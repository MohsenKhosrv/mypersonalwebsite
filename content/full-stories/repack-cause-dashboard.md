# Repack Cause Dashboard

*A Power BI Case Study in ETL, Data Modeling, DAX & Visualization*

| **&lt;3 months** | **~70%** | **End-to-End** |
|---|---|---|
| to reduce the pace of new repack creation | reduction in on-hold inventory within 6 months | solution: source data → ETL → model → DAX → report |

## Executive Summary

The Repack Cause Dashboard is a Power BI solution I designed and built end-to-end to solve a persistent, expensive problem in a manufacturing and packaging environment: finished cartons that had to be reworked ("repacked") after a quality issue, with no visibility into which quality events were actually driving that rework. The source system destroyed the evidence every time it deleted the original carton record and created a new one as part of the repack process. I traced that lineage back from the system's own audit log, rebuilt it as a governed data model, and delivered a report that gave Operations and Quality leadership their first real view into repack root causes. Within three months, the pace of new repack creation had slowed. Within six months, on-hold inventory was down roughly 70%.

## The Problem

### What a Repack Is

The product is a precision-manufactured component, produced in batches and packed into cartons for shipment to downstream assembly customers. Each carton typically pools components from several different production batches. When quality testing on a batch comes back after the fact and it's downgraded, found not to meet first-grade quality, every carton containing components from that batch has to be opened back up: the affected components pulled, replacements inserted, and the carton re-packed and re-sealed. That rework cycle is a "repack," and it is expensive. It consumes packing capacity that would otherwise go toward new production.

### Why It Was Getting Worse

- Repack work always lost the priority fight against new production for packing capacity, so it piled up into a growing backlog.
- Backlogged cartons meant held inventory and tied-up cash: product that was finished but not shippable.
- The business knew repack volume was a problem, but had no visibility into what was driving it. Without that, there was no way to prioritize fixing the quality issues that mattered most.
- The reason for that blind spot was structural: whenever a repack was processed, the source system deleted the original carton record and created a new one. That silently severed the link between a carton and the quality event that caused its rework.
- The lack of a reliable link also created an operational ambiguity problem: a carton might be flagged for one reason but still on hold for a second, unrelated one. Without a way to confirm all causes were resolved, teams would over-repack cartons defensively, reworking more than necessary just to be safe when shipments were tight.

> *The core challenge wasn't building charts. It was recovering data that the source system was actively destroying, before any of the reporting could happen.*

## Approach

### 1. Discovery & Business Case

I started by interviewing Operations leadership, the Quality team, and Supply Chain to confirm the pain points and understand how each group experienced the problem differently. Operations cared about shippable capacity, Quality cared about root-cause trends, and Supply Chain cared about backlog and cash. That input became the business case for the project. From there I worked with IT to identify where the relevant data actually lived across the source systems.

### 2. Recovering the Repack Lineage

The central technical challenge was reconstructing a link the source system was designed to erase. I found that every repack and every quality-hold action left an entry in the system's audit log, a free-text description field never intended for analytics, written for human operators, not for reporting. By studying the structure of that text, I identified a repeatable pattern: entries tagged as a quality hold embedded the event ID and its reason code directly in the sentence; entries tagged as a hold-and-repack embedded a human-written reason. I built logic to parse that text and extract those values reliably, effectively rebuilding the deleted connection between a carton and the event that caused its rework.

That alone wasn't enough, though. A single carton could be tied to more than one quality event, several components from several different problem batches, each logged separately. So the model had to resolve, per carton, the complete set of causes, and it had to still produce a result for repacked cartons where the cause couldn't be confidently matched from the text, so that no carton silently disappeared from the analysis. I addressed this with a dedicated summary layer that consolidates every matched cause per carton and falls back to an explicit "unresolved" placeholder when no match exists, guaranteeing complete coverage of every repacked carton.

### 3. Data Architecture

Below the reporting layer, I built a lean extraction pipeline pulling directly from the production database, with filtering and column selection pushed down into native SQL rather than done in Power BI, keeping refreshes fast and avoiding pulling years of irrelevant log history into memory. On top of that, I designed a relational model connecting five core entities: the carton master record, the audit log, the quality-event log, and a component-level table with its own event-linking bridge, allowing the analysis to trace impact all the way down to which specific components, and how much weight, were affected by a given quality event.

### 4. Semantic Layer & DAX

With the lineage-recovery text-parsing logic and the model relationships in place, I layered in the business logic: classification of repacks as manual vs. system-driven, production-line/asset groupings, turnaround-time calculations, and a measure quantifying how many cartons a single quality event typically affects, a useful signal for spotting events with outsized downstream impact. Full DAX and Power Query code for all of this is included in the Technical Appendix.

### 5. Visualization

I designed the report as five pages moving from operational to diagnostic: a primary landing page showing overall quality impact (including an AI-generated narrative summary of quality event notes), a "last 7 days" operational view for daily use, trend pages for repack creation and for non-quality-driven repacks specifically, and an event-trends page for spotting whether specific production lines were generating disproportionate quality issues versus disproportionate rework volume. Consistent slicers for date range, production line, and reason code tie the pages together, with a shared detail table available for drill-down.

### 6. Delivery

I presented the finished dashboard to Operations, Quality, and technical stakeholders, walking through how to read repack causes, how to use the trend pages to prioritize root-cause work, and how the tool removed the guesswork that previously drove over-repacking.

## Impact

- Reduced the pace of new repack creation within three months of rollout.
- Reduced on-hold inventory by roughly 70% within six months, unlocking working capital that had been tied up in cartons awaiting rework.
- Gave Operations and Quality leadership their first visibility into which quality events were actually driving repack volume, shifting root-cause investment from guesswork to data.
- Reduced ambiguity at ship time: because every cause for a given carton is now visible in one place, teams could confirm a carton was fully cleared instead of defensively over-repacking it.

## Skills & Tools

| Capability | Demonstrated By |
|---|---|
| ETL / Data Engineering | Designing a production-database-to-Power-BI pipeline with server-side filtering and incremental extraction windows |
| Relational Database Design | Modeling a multi-entity schema with bridge tables resolving many-to-many relationships between cartons, components, and quality events |
| Advanced DAX | Text-mining calculated columns to recover deleted data lineage; a fully DAX-authored calculated table with set-based logic and complete-coverage guarantees |
| Data Reverse-Engineering | Independently identifying and exploiting a recoverable pattern in an undocumented system audit log |
| Data Visualization / UX Design | A five-page report structured to move users from operational triage to root-cause diagnosis |
| Stakeholder Management | Owning the project from initial business-case interviews through final delivery to Operations, Quality, and technical audiences |

*Full DAX and Power Query source code referenced throughout this case study is provided in the Technical Appendix below. Table names, column names, and internal codes have been generalized throughout for external sharing.*

---

## Technical Appendix: Code Reference

This appendix contains the underlying Power Query (M) and DAX code referenced narratively above, for technical reviewers who want to inspect the implementation directly. Table/column names and internal codes have been generalized; the logic and structure are unchanged from the production implementation.

### A.1 Power Query (M): Source Extraction

**Carton**

```m
let
    Source = Sql.Database("LegacyMES", "ProductionHistoryDB", [Query =
        "SELECT release_code, blend_code, production_line, carton_id, repack_date,
         quality_grade, repack_required_flag, pack_date, earliest_component_date,
         latest_component_date, archived_date, ready_to_ship_date
         FROM dbo.Carton
         WHERE pack_date >= '2025-01-01 12:00:00 AM'
         AND total_tare_weight_kg > 0
         AND quality_grade IN ('Grade_A', 'Grade_B')"])
in
    Source
```

**Carton_Audit_Log**

```m
let
    Source = Sql.Database("LegacyMES", "ProductionHistoryDB", [Query =
        "SELECT log_type, log_description, carton_id, log_date
         FROM dbo.Carton_Audit_Log
         WHERE log_date > '2024-07-01'
         AND log_type IN ('HoldAndReworkLogged','HoldLogged')"])
in
    Source
```

**Quality_Event**

```m
let
    Source = Sql.Database("LegacyMES", "ProductionHistoryDB", [Query =
        "SELECT end_date, event_date, event_notes, insert_date, start_date,
         quality_event_id, sub_reason_code, update_date, event_status,
         event_ref_id, reason_code
         FROM dbo.Quality_Event
         WHERE start_date >= '2024-07-01 12:00:00 AM' AND current_flag = 'Y'"]),
    #"Changed Type" = Table.TransformColumnTypes(Source,
        {{"quality_event_id", type text}, {"event_ref_id", type text}})
in
    #"Changed Type"
```

**Component**

```m
let
    Source = Sql.Database("LegacyMES", "ProductionHistoryDB", [Query =
        "SELECT component_id, production_date, carton_id, carton_grade,
         component_grade, original_grade
         FROM dbo.Component
         WHERE production_date >= '2024-07-01 12:00:00 AM'"])
in
    Source
```

**Component_Quality_Link**

```m
let
    Source = Sql.Database("LegacyMES", "ProductionHistoryDB", [Query =
        "SELECT component_id, unit_weight, quality_event_id, event_ref_id
         FROM dbo.Component_Quality_Link
         WHERE event_date >= '2024-07-01'
         AND quality_event_id IS NOT NULL"]),
    #"Changed Type" = Table.TransformColumnTypes(Source,
        {{"quality_event_id", type text}, {"event_ref_id", type text}})
in
    #"Changed Type"
```

### A.2 DAX: Repack Lineage Recovery (Carton_Audit_Log calculated columns)

**Quality_Event_ID** — extracting the quality event identifier

```dax
Quality_Event_ID =
IF (
    'Carton_Audit_Log'[log_type] = "HoldLogged",
    VAR StartPos = SEARCH("Event ", 'Carton_Audit_Log'[log_description], , 0)
    RETURN
        IF (
            StartPos > 0,
            MID('Carton_Audit_Log'[log_description], StartPos + 6, 6),
            BLANK()
        ),
    BLANK()
)
```

**Quality_Reason_Code** — extracting the reason code

```dax
Quality_Reason_Code =
IF (
    'Carton_Audit_Log'[log_type] = "HoldLogged",
    VAR StartPos = SEARCH("Reason Code", 'Carton_Audit_Log'[log_description], , 0)
    VAR WordStart = StartPos + LEN("Reason Code") + 1
    VAR RemainingText = MID('Carton_Audit_Log'[log_description], WordStart, LEN('Carton_Audit_Log'[log_description]))
    VAR NextSpace = SEARCH(".", RemainingText, , 0)
    VAR Word =
        IF (
            NextSpace > 0,
            LEFT(RemainingText, NextSpace - 1),
            RemainingText
        )
    RETURN Word,
    BLANK()
)
```

**Repack_Reason** — extracting the human-written repack reason

```dax
Repack_Reason =
IF (
    'Carton_Audit_Log'[log_type] = "HoldAndReworkLogged",
    VAR SourceText = 'Carton_Audit_Log'[log_description]
    VAR Tag = "reason: "
    VAR TagPos = SEARCH( Tag, SourceText, , 0 )
    VAR AfterTagPos = TagPos + LEN( Tag )
    VAR Tails = IF ( TagPos > 0, MID ( SourceText, AfterTagPos, LEN ( SourceText ) ), BLANK() )
    VAR AndPos = IF ( NOT ISBLANK ( Tails ), SEARCH ( " and", Tails, , 0 ), 0 )
    VAR Extracted = IF ( AndPos > 0, LEFT ( Tails, AndPos - 1 ), Tails )
    RETURN TRIM ( Extracted ),
    BLANK()
)
```

**Grade_Override_Applied** — flagging grade-mix overrides

```dax
Grade_Override_Applied =
IF (
    Carton_Audit_Log[log_type] = "HoldLogged"
        && SEARCH ( "grade override applied", LOWER ( Carton_Audit_Log[log_description] ), , 0 ) > 0,
    1,
    BLANK()
)
```

### A.3 DAX: Carton_Repack_Summary (Calculated Table)

The bridge table that consolidates every matched cause per carton and guarantees a row for every repacked carton, even when no cause could be text-matched:

```dax
Carton_Repack_Summary =
VAR CartonsWithRepack =
    FILTER (
        SUMMARIZE ( Carton_Audit_Log, Carton_Audit_Log[carton_id] ),
        CALCULATE (
            COUNTROWS ( FILTER ( Carton_Audit_Log, Carton_Audit_Log[log_type] = "HoldAndReworkLogged" ) )
        ) > 0
    )
VAR OverrideRows =
    FILTER (
        Carton_Audit_Log,
        Carton_Audit_Log[log_type] = "HoldLogged"
            && Carton_Audit_Log[Grade_Override_Applied] = 1
    )
-- A) Matched cause rows, for cartons that also have a Repack
VAR A_WithOverride =
    ADDCOLUMNS (
        SELECTCOLUMNS (
            FILTER (
                OverrideRows,
                VAR Cart = Carton_Audit_Log[carton_id]
                RETURN
                    CALCULATE (
                        COUNTROWS (
                            FILTER ( ALL ( Carton_Audit_Log ),
                                Carton_Audit_Log[carton_id] = Cart
                                    && Carton_Audit_Log[log_type] = "HoldAndReworkLogged"
                            )
                        )
                    ) > 0
            ),
            "carton_id", Carton_Audit_Log[carton_id],
            "quality_event_id", Carton_Audit_Log[Quality_Event_ID],
            "quality_reason_code", Carton_Audit_Log[Quality_Reason_Code],
            "quality_event_date", Carton_Audit_Log[log_date]
        ),
        "first_repack_date",
            VAR C1 = [carton_id]
            RETURN
                CALCULATE (
                    MIN ( Carton_Audit_Log[log_date] ),
                    FILTER ( ALL ( Carton_Audit_Log ),
                        Carton_Audit_Log[carton_id] = C1
                            && Carton_Audit_Log[log_type] = "HoldAndReworkLogged" )
                ),
        "repack_cause_count",
            VAR C2 = [carton_id]
            RETURN
                CALCULATE (
                    COUNTROWS ( Carton_Audit_Log ),
                    FILTER ( ALL ( Carton_Audit_Log ),
                        Carton_Audit_Log[carton_id] = C2
                            && Carton_Audit_Log[log_type] = "HoldAndReworkLogged" )
                )
    )
-- B) Repacked cartons with NO matched cause, one placeholder row each
VAR CartonsWithOverride = SUMMARIZE ( OverrideRows, Carton_Audit_Log[carton_id] )
VAR CartonsNeedingPlaceholder = EXCEPT ( CartonsWithRepack, CartonsWithOverride )
VAR B_NoOverride_Placeholders =
    ADDCOLUMNS (
        CartonsNeedingPlaceholder,
        "quality_event_id", BLANK (),
        "quality_reason_code", BLANK (),
        "quality_event_date", BLANK (),
        "first_repack_date",
            VAR C3 = [carton_id]
            RETURN
                CALCULATE (
                    MIN ( Carton_Audit_Log[log_date] ),
                    FILTER ( ALL ( Carton_Audit_Log ),
                        Carton_Audit_Log[carton_id] = C3
                            && Carton_Audit_Log[log_type] = "HoldAndReworkLogged" )
                ),
        "repack_cause_count",
            VAR C4 = [carton_id]
            RETURN
                CALCULATE (
                    COUNTROWS ( Carton_Audit_Log ),
                    FILTER ( ALL ( Carton_Audit_Log ),
                        Carton_Audit_Log[carton_id] = C4
                            && Carton_Audit_Log[log_type] = "HoldAndReworkLogged" )
                )
    )
RETURN
    UNION ( A_WithOverride, B_NoOverride_Placeholders )
```

**quality_reason_code_simplified** — reason code normalization

```dax
quality_reason_code_simplified =
VAR Code = TRIM ( [quality_reason_code] )
VAR LastChar = RIGHT ( Code, 1 )
RETURN
    IF (
        Code <> BLANK ()
            && LastChar >= "0"
            && LastChar <= "9",
        LEFT ( Code, LEN ( Code ) - 1 ),
        Code
    )
```

### A.4 DAX: Supporting Attributes & Measures

**Asset_Group** — production-line grouping

```dax
Asset_Group =
SWITCH(
    TRUE(),
    'Carton'[production_line] IN {"Line_01","Line_02","Line_03","Line_04","Line_05","Line_06","Line_07","Line_08","Line_09","Line_10"}, "Asset_1",
    'Carton'[production_line] IN {"Line_11","Line_12","Line_13","Line_14"}, "Asset_2",
    'Carton'[production_line] IN {"Line_15","Line_16","Line_17","Line_18","Line_19","Line_20","Line_21","Line_22"}, "Asset_3",
    'Carton'[production_line] IN {"Line_23"}, "Asset_4",
    BLANK()
)
```

**Repack_Method** — manual vs. system classification

```dax
Repack_Method =
IF (
    'Carton'[production_line] IN {"Line_15","Line_16", "Line_17", "Line_18"}
        || 'Carton'[release_code] IN {"Code_A", "Code_B"},
    "2.Manual",
    "1.System"
)
```

**Days_ReadyToShip_to_Archived** — turnaround time

```dax
Days_ReadyToShip_to_Archived = Carton[archived_date].[Date] - Carton[ready_to_ship_date].[Date]
```

**Component grade-change flags**

```dax
component_grade_changed = IF(NOT(Component[component_grade] = Component[original_grade]), 1, 0)
component_carton_grade_diff = IF(NOT(Component[component_grade] = Component[carton_grade]), 1, 0)
Is_Grade_A = IF((Component[component_grade] = "Grade_A"), 1, 0)
Is_Grade_B = IF((Component[component_grade] = "Grade_B"), 1, 0)
Is_Downgraded = 1 - (Component[Is_Grade_A] + Component[Is_Grade_B])
```

**Repacks per Quality Event** — measure

```dax
Repacks per Quality Event = DISTINCTCOUNT(Carton_Repack_Summary[carton_id]) / DISTINCTCOUNT(Carton_Repack_Summary[quality_event_id])
```

### A.5 Relationship Reference

| From | To | Cardinality | Cross-filter | Active |
|---|---|---|---|---|
| Component_Quality_Link[component_id] | Component[component_id] | Many : 1 | Both directions | Yes |
| Component_Quality_Link[event_ref_id] | Quality_Event[event_ref_id] | Many : 1 | Both directions | Yes |
| Component[carton_id] | Carton[carton_id] | Many : 1 | Both directions | No (inactive) |
| Carton_Audit_Log[carton_id] | Carton[carton_id] | Many : 1 | Both directions | Yes |
| Carton_Repack_Summary[carton_id] | Carton[carton_id] | Many : 1 | Both directions | Yes |
| Carton_Repack_Summary[quality_event_id] | Quality_Event[quality_event_id] | Many : 1 | Both directions | Yes |
