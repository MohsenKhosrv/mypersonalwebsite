# Demand Forecasting Transformation

*Role: Business Analyst | Industry: Polymer Production | Timeline: ~6 months*

## Background

At a polymer production company, demand forecasting was handled by the commercial team using a method inherited from previous team members. When a new commercial team arrived, they found themselves disconnected from the logic behind the numbers they were expected to maintain. Forecasts were being entered into the system with limited analytical grounding, and there was a natural tendency to project demand increases rather than reflect reality.

The result was a forecasting process that was both inaccurate and unstable. Numbers changed frequently, and no one could clearly explain why.

## The Problem

Unreliable demand forecasts created a chain reaction across the business. Production plans had to be revised repeatedly, and each revision triggered a product changeover on the production asset. These changeovers were not minor adjustments. Each one carried a cost exceeding $100K, and the business was absorbing multiple changeovers per month.

Downstream, the instability spread further. Raw material procurement was planned against a moving target, making it impossible to optimize order timing or volumes. To compensate for the uncertainty, the business held elevated safety stock levels for both raw materials and finished goods. Inventory was essentially being used as a buffer against a problem that had an analytical solution.

The operations, maintenance, and technical teams were all planning against a forecast they could not trust. Replanning became a recurring activity rather than an exception.

## My Approach

I started by mapping the problem space. I worked with the commercial team and the customer experience team to understand their process, collect the sources of data available, and document what they actually needed from a forecasting method.

With that foundation in place, I pulled five years of actual shipment data and began exploratory data analysis. My starting hypothesis was that demand, at the customer and product line level, is more stable than the existing process assumed.

I segmented customers by order volume and product lines by category, then classified each customer-product combination into one of four behavioral patterns: stable, growing, declining, or volatile. The analysis confirmed that approximately 80% of customer-product combinations fell into the stable category.

This finding shaped the forecasting method I set out to test. The core question was: can a rolling average of historical shipment data reliably predict demand for the next one to three months?

I tested three averaging windows: three months, six months, and twelve months. For each window, I calculated the average monthly demand and the standard deviation, then computed the coefficient of variation to normalize variance across different products and volumes. The six-month rolling average consistently produced the lowest coefficient of variation across the material set, making it the most reliable predictor.

To validate this, I used a train-test approach. I built the forecasting model on the first three years of data and tested it against year four. After adjusting the method based on those results, I tested it again on year five. The method held.

For the stable majority, the six-month rolling average became the baseline forecast. Two additional layers were added on top:

- **Customer-provided signals:** if a customer indicated their demand would change in the coming month, that input was incorporated as an adjustment to the baseline.
- **Growth and decline segments:** for products showing a consistent directional trend, I applied the measured growth or decline rate and worked with the commercial team to validate those projections before deployment.

The final method was reviewed collaboratively with both the commercial and customer experience teams. The new commercial team was analytically receptive and engaged throughout the process. Their openness made adoption significantly smoother than it might have been.

## Results

Within three months of deployment, demand accuracy reached above 90% and held there. The business had set 90% as the target threshold, and the method met it consistently.

The downstream effects followed. Production plans stabilized, reducing the frequency of product changeovers on the assets and avoiding several hundred thousand dollars in changeover costs. Operations, maintenance, and technical teams gained reliable visibility to plan their work.

Combined with a parallel safety stock optimization initiative, the improved forecast reliability contributed to approximately $1M in raw material cost savings through reduced inventory levels. With uncertainty reduced, the business no longer needed to hold the same buffers it had relied on before.

## What I Learned

The most important decision in this project was the starting hypothesis: that demand is stable until proven otherwise. Without that framing, I might have started with complex models that were harder to validate and harder for the commercial team to trust and use.

Simplicity, when it is grounded in data, is more durable than sophistication for its own sake. A six-month rolling average is not a glamorous forecasting method. But it worked, the team understood it, and it held up under validation. That combination is what made it deployable.

The collaboration with the commercial and customer experience teams was also essential. A method that lives only in an analyst's model does not change how a business operates. Getting the right people involved early, understanding their constraints, and building something they could own and maintain was as important as the analysis itself.
