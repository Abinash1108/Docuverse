---
sidebar_position: 1
---

# PB1 : Reverting payment for an invoice

This guide explains the process for reverting the payment of an invoice and reset the invoice status back to unpaid. This should only be used in the rare case that a payment was made unexpectedly, for example if an invoice was marked as paid off-platform when it should not have been according to the marketplace configuration.

We have seen this happen several times with AppSmart due to bugs or oversights in the code. When this happens, the data must be fixed by DBCM, as explained in the following instructions.

The SQL queries in this document use the following placeholders:
* `{INVOICE_NUMBER}`: JBilling invoice ID
* `{PAYMENT_NUMBER}`: JBilling payment ID
* `{PAYMENT_ID}`: Monolith payment ID
* `{PURCHASE_ORDER_IDS}`: Monolith purchase order ID(s)
* `{PS_PAYMENT_ID}`: Payment service payment ID (Payments V2 Framework only)

## Prerequisite: Identify the affected invoice and payment

Identify the JBilling invoice and payment IDs on the invoice details page for the affected invoice
## 1. Mark JBilling invoice as unpaid and re-import into monolith

Here, we need to set the JBilling invoice status to 27 (corresponds to AppDirect status UNPAID, see [this page](https://appdirect.jira.com/wiki/spaces/EN/pages/216349069/Invoice+Status+Monitoring) for the full list of status mappings). We also need to reset the balance to the invoice total:
```sql
UPDATE jbilling.invoice jbi SET status_id = 27, balance = jbi.total WHERE jbi.id = {INVOICE_NUMBER};
```
Optionally, the `due_date` column can be modified as well if the invoice due date needs to change.

After this, we re-import the JBilling invoice into the monolith, which will automatically update the monolith invoice entity to reflect the change:
```sql
INSERT INTO appdirect.imported_entities (entity_id, entity_type, jbilling_instance_type, created_on, last_modified) VALUES ({INVOICE_NUMBER}, 'INVOICE', 'LIVE', now(), now());
```

The invoice re-import process will also update the reconciliation lines.

## 2. Soft-delete JBilling payment and re-import into monolith

Here, we need to soft-delete the JBilling payment:
```sql
UPDATE jbilling.payment SET deleted = 1, update_datetime = now() WHERE id = {PAYMENT_NUMBER};
```

After this, we re-import the JBilling payment into the monolith, which will automatically update the monolith payment entity to reflect the change:
```sql
INSERT INTO appdirect.imported_entities (entity_id, entity_type, jbilling_instance_type, created_on, last_modified) VALUES ({PAYMENT_NUMBER}, 'PAYMENT', 'LIVE', now(), now());
```

## 3. Update the purchase order invoice status

Here, we need to update the purchase order invoice status to UNPAID.

Identify the purchase order ID(s) with the following query:
```sql
SELECT po.id FROM appdirect.invoices i
INNER JOIN appdirect.invoice_2_order i2o ON i2o.invoice_id = i.id
INNER JOIN appdirect.purchase_orders po ON po.id = i2o.purchase_order_id
WHERE i.invoice_number = {INVOICE_NUMBER};
```

Note that there may be more than one purchase order associated with the invoice.

Update the invoice status for the purchase order(s):
```sql
UPDATE appdirect.purchase_orders SET invoice_status = 'UNPAID', last_modified = now() WHERE id in {PURCHASE_ORDER_IDS};
```
Optionally, the `payment_due_date` column of the purchase order(s) can be modified as well, if the payment due date needs to change.

## 4. Delete the payment activity

Here, we need to delete the payment activity for this invoice, so that it will no longer show up in the list of activities for the user or company.

Note that this query uses the monolith payment ID, **not** the JBilling payment ID.

Identify the monolith payment ID with the following query:
```sql
SELECT id FROM appdirect.payments
WHERE payment_number = {PAYMENT_NUMBER};
```

Delete the activity for this payment ID:
```sql
DELETE FROM appdirect.activities WHERE payment_object_id = {PAYMENT_ID};
```

## 5. Soft-delete the payment in Payment Service

If the marketplace is using Payments V2 Framework, the payment in Payment Service needs to be soft-deleted as well.

Identify the payment service payment ID using the following query:
```sql
SELECT id FROM payment.payments
WHERE invoice_number = {INVOICE_NUMBER} AND payment_number = {PAYMENT_NUMBER};
```

Soft-delete the payment in Payment Service:
```sql
UPDATE payment.payments SET is_deleted = 1, updated_on = now() WHERE id = {PS_PAYMENT_ID};
```

## 6. Sync the invoice in Invoice Core

If the marketplace is using Invoices V2, Invoice Core needs to be manually resynced to get the updated invoice from JBilling. Otherwise, the update will not be reflected in the invoice UI and it will still display the invoice as paid.

To sync the invoice in Invoice Core, please reach out to `@invoicing` in the `#tech-billing` Slack channel. A member of the team will sync the invoice using an internal API.

## 7. Verify that the data is correct

Once the DBCM and invoice sync are complete, verify in the UI and the database that the invoice, payment and purchase order data are as expected.

## Reference CIM tickets and corresponding DBCMs

* [CIM-1514](https://appdirect.jira.com/browse/CIM-1514)
  * [DBCM-6956](https://appdirect.jira.com/browse/DBCM-6956)
  * [DBCM-6957](https://appdirect.jira.com/browse/DBCM-6957)
  * [DBCM-6962](https://appdirect.jira.com/browse/DBCM-6962)
* [CIM-1715](https://appdirect.jira.com/browse/CIM-1715)
  * [DBCM-7042](https://appdirect.jira.com/browse/DBCM-7042)
  * [DBCM-7100](https://appdirect.jira.com/browse/DBCM-7100)