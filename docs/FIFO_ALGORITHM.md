# FIFO Capital Gains Algorithm

## Overview

CapTax AI uses the First In, First Out (FIFO) method to match sell transactions with previously purchased lots.

## How It Works

1. Transactions are grouped by stock symbol.
2. Transactions are sorted by transaction date.
3. BUY transactions are stored as purchase lots.
4. When a SELL transaction occurs, it is matched against the oldest available BUY lot.
5. If a sell quantity is larger than the available quantity in a lot, the algorithm continues with the next oldest lot.
6. For every matched quantity, CapTax AI calculates the cost basis, sale value, and gain or loss.
7. The holding period is calculated from the purchase date to the sale date.
8. Holdings that have not been sold remain as open lots.

## Output

The FIFO calculation produces:

- Matched buy and sell transactions
- Cost basis
- Sale value
- Gain or loss
- Holding period
- Short-term or long-term classification
- Remaining holdings

## Implementation

The main FIFO implementation is located at:

ackend/app/algorithms/fifo.py

This module is used by the capital-gains calculation functionality of CapTax AI.
