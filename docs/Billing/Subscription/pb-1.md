---
sidebar_position: 1
---

# PB1 : Handle Discounts in Pricing Service

### Payload definition for discount support
A new discount configuration object will be received as input with following information:
* discountId: external ID for the discount entity
* strategy: UNLIMITED or BILLING_CYCLES
* billingCycles: number of billing cycles for the BILLING_CYCLES strategy
#### Restriction
Redemption will be handled by pricing service:
* Subscription service won't handle redemption strategy (ex: ONCE_PER_COMPANY)
* Discount will only be available with OFS integration, because discount redemption is executed
by the monolith with finalization v1. A blocking restriction will be returned if there is a
discount and finalization v2 is not enabled.

Example:

INPUT
```
{
    "purchaseContext": {
        ...
    },
    "items": [
        {
            "itemId": "abcd",
            "productId": "abcd",
            "editionId": "abcd",
            "pricingPlanId": "abcd",
            "serviceConfiguration": {
                "strategy": "IMMEDIATELY"
            },
            "discountConfiguration": {
                "discountId": "abcd",
                "strategy": "BILLING_CYCLES",
                "billingCycles": 6
            }
        }
    ]
}
```
OUTPUT
```
[
    {
        "itemId": "abcd",
        "subscriptionTransitionRestrictions": [
            {
                "category: "DISCOUNT",
                "type": "BLOCKING",
                "restrictionCode": "DISCOUNT_UNAVAILABLE"
            }
        ]
]
```
#### Compute schedule operation
2 new timeline events: DISCOUNT_START and DISCOUNT_END.

Example:

INPUT
```
{
    "context": {
        ...
    },
    "items": [
        {
            "itemId": "abcd",
            "productId": "abcd",
            "editionId": "abcd",
            "pricingPlanId": "abcd",
            "pricingPeriod": "MONTHLY",
            "serviceConfiguration": {
                "strategy": "IMMEDIATELY"
            },
            "discountConfiguration": {
                "discountId": "abcd",
                "strategy": "BILLING_CYCLES",
                "billingCycles": 6
            }
        }
    ]
}
```

OUTPUT
```
[
    {
        "itemId": "abcd",
        "schedule": {
            "billingCycle": {
                ...
            },
            "events": [
                {
                    "eventType": "SERVICE_ACTIVATION",
                    "date": "2019-09-10"
                },
                {
                    "eventType": "BILLING_EFFECTIVE",
                    "date": "2019-09-10"
                },
                {
                    "eventType": "DISCOUNT_START",
                    "date": "2019-09-10"
                },
                {
                    "eventType": "DISCOUNT_END",
                    "date": "2020-03-10"
                }
            ]
        }
    }
]
```

#### Finalization request
Subscription will receive the discount configuration again, along with the discount costs.

Examples:

INPUT with flat discount per unit
```
{
   "purchaseContext": {
        ...
    },
    "items": [
        {
            "itemId": "abcd",
            "productId": "abcd",
            "editionId": "abcd",
            "pricingPlanId": "abcd",
            "pricingPeriod": "MONTHLY",
            "serviceConfiguration": {
                "strategy": "IMMEDIATELY"
            },
            "discountConfiguration": {
                "discountId": "abcd",
                "strategy": "BILLING_CYCLES",
                "billingCycles": 6
            }
            "costs": [
                {
                    "costTypeCategory": "RECURRING",
                    "costType": "RECURRING_PER_UNIT",
                    "pricingStrategy": "UNIT",
                    "unit": "USER",
                    "calculations": [
                        {
                            "quantity": "2.0000000000",
                            "salePrice": "10.0000000000",
                            "totalPrice": "20.0000000000"
                        }
                    ]
                },
                {
                    "costTypeCategory": "RECURRING",
                    "costType": "DISCOUNT_PER_UNIT",
                    "pricingStrategy": "UNIT",
                    "unit": "USER",
                    "detailedCost": {
                        "sources": [
                            {
                                "priceType": "BASE_PRICE",
                                "definition": {
                                    "priceRanges": [
                                        {
                                            "min": "0.0000000000",
                                            "price": "-2.0000000000"
                                        }
                                    ]
                                },
                                "calculations": [
                                    {
                                        "quantity": "2.0000000000",
                                        "salePrice": "-2.0000000000",
                                        "totalPrice": "-4.0000000000"
                                    }
                                ]
                            }
                        ]
                    },
                    "calculations": [
                        {
                            "quantity": "2.0000000000",
                            "salePrice": "-2.0000000000",
                            "totalPrice": "-4.0000000000"
                        }
                    ]
                }
            ]
        }
    ]
}
```

INPUT with percentage discount per unit
```
{
   "purchaseContext": {
        ...
    },
    "items": [
        {
            "itemId": "abcd",
            "productId": "abcd",
            "editionId": "abcd",
            "pricingPlanId": "abcd",
            "pricingPeriod": "MONTHLY",
            "serviceConfiguration": {
                "strategy": "IMMEDIATELY"
            },
            "discountConfiguration": {
                "discountId": "abcd",
                "strategy": "BILLING_CYCLES",
                "billingCycles": 6
            }
            "costs": [
                {
                    "costTypeCategory": "RECURRING",
                    "costType": "RECURRING_PER_UNIT",
                    "pricingStrategy": "UNIT",
                    "unit": "USER",
                    "calculations": [
                        {
                            "quantity": "2.0000000000",
                            "salePrice": "10.0000000000",
                            "totalPrice": "20.0000000000"
                        }
                    ]
                },
                {
                    "costTypeCategory": "RECURRING",
                    "costType": "DISCOUNT_PER_UNIT",
                    "pricingStrategy": "PERCENTAGE",
                    "unit": "USER",
                    "detailedCost": {
                        "sources": [
                            {
                                "priceType": "BASE_PRICE",
                                "definition": {
                                    "priceRanges": [
                                        {
                                            "min": "0.0000000000",
                                            "price": "-0.5000000000"
                                        }
                                    ]
                                },
                                "calculations": [
                                    {
                                        "quantity": "2.0000000000",
                                        "salePrice": "-5.0000000000",
                                        "totalPrice": "-10.0000000000"
                                    }
                                ]
                            }
                        ]
                    },
                    "calculations": [
                        {
                            "quantity": "2.0000000000",
                            "salePrice": "-5.0000000000",
                            "totalPrice": "-10.0000000000"
                        }
                    ]
                }
            ]
        }
    ]
}
```