---
sidebar_position: 1
---

# PB1 : Fix MS and CE status Discrepancy

# 1 Introduction 
This playbook will help you to identify active `mosi_subscriptions` entry which are not mapped to any active company entitlements. And it will also provide SQL files to be used to generate DBCM to fix this data discrepancy.


# 2 Identify unmapped active entries in mosi_subscriptions
Below query to be used to identify active `mosi_subscriptions` entry which are not mapped to any active company entitlements.

```sql
select
    ms.subscription_id,
    ms.crest_subscription_id,
    ms.state,
    ms.company_entitlement_id,
    ce.id,
    ce.external_vendor_identifier,
    ce.status

from
    mosi_subscriptions ms
        inner join company_entitlements ce on ce.id = ms.company_entitlement_id
where
    ce.external_vendor_identifier != ms.subscription_id
	and ce.external_vendor_identifier is not null
	and ce.status = 'ACTIVE'
	and ms.state = 'SUBSCRIPTION_STATUS_ACTIVE';
```

# 3 Generate DBCM files 
## 3.1 pre-verify.sql
```sql
select
    ms.subscription_id,
    ms.state
from
    mosi_subscriptions ms
    inner join company_entitlements ce on ce.id = ms.company_entitlement_id
where
    ce.external_vendor_identifier != ms.subscription_id
	and ce.external_vendor_identifier is not null
	and ce.status = 'ACTIVE'
	and ms.state = 'SUBSCRIPTION_STATUS_ACTIVE';

```
## 3.2 pre-verify_expected.txt
This one is generated as of 2022-10-04.
```sql
subscription_id	state
00000000-65da-3cfd-0000-012ebbed66f2	SUBSCRIPTION_STATUS_ACTIVE
01411896-9967-4e4b-a363-91975bf2616f	SUBSCRIPTION_STATUS_ACTIVE
0e7a000d-ed86-4a78-bbdd-c7d583495978	SUBSCRIPTION_STATUS_ACTIVE
1389e2c6-96a3-4730-af8f-8cd7e73e19a8	SUBSCRIPTION_STATUS_ACTIVE
1b0b51a8-7662-4de0-960d-a478c6168818	SUBSCRIPTION_STATUS_ACTIVE
23808ddb-e93f-4a57-93f0-a861ebed3b74	SUBSCRIPTION_STATUS_ACTIVE
2425e3e4-7caa-419e-8f00-11218ae62397	SUBSCRIPTION_STATUS_ACTIVE
31b61908-aa3a-42b3-92c9-600380d334ed	SUBSCRIPTION_STATUS_ACTIVE
331b48ca-e8b7-4668-bec5-135f30d4133a	SUBSCRIPTION_STATUS_ACTIVE
35edfa7a-216a-4894-8cae-b1279fda7a92	SUBSCRIPTION_STATUS_ACTIVE
3910ecd1-4add-4cb2-a7d2-e6201c1ac0d0	SUBSCRIPTION_STATUS_ACTIVE
3c3a9b7a-a94d-4f3a-8491-c46955e1c844	SUBSCRIPTION_STATUS_ACTIVE
40067bea-2d44-4518-996a-032f093964a2	SUBSCRIPTION_STATUS_ACTIVE
43f0c25c-498c-4003-8e23-d9dc15b28474	SUBSCRIPTION_STATUS_ACTIVE
5021ed6c-4deb-4c5b-af00-25ecc75fc184	SUBSCRIPTION_STATUS_ACTIVE
53b7a113-3eca-48b9-b190-58773ae679d1	SUBSCRIPTION_STATUS_ACTIVE
584e2fda-84b9-44f6-b2d5-aeaffb51ca19	SUBSCRIPTION_STATUS_ACTIVE
5c2a01b5-d9e9-4934-8dde-ebbdcab6bcea	SUBSCRIPTION_STATUS_ACTIVE
5ef5164b-7ded-439e-997c-0aae044b3acc	SUBSCRIPTION_STATUS_ACTIVE
63e2632f-4fc2-4881-8d93-4916f4cd6845	SUBSCRIPTION_STATUS_ACTIVE
6b6bc6af-5ae8-47a1-9e37-a9fdf4693ec5	SUBSCRIPTION_STATUS_ACTIVE
71813775-7dbf-4898-8502-05e19758af53	SUBSCRIPTION_STATUS_ACTIVE
724a3e44-a706-4af2-824e-9c4c32d6e9dd	SUBSCRIPTION_STATUS_ACTIVE
732eb927-04d0-433a-a437-42b090cdbe67	SUBSCRIPTION_STATUS_ACTIVE
81be5e87-14a8-4b3f-93d5-9c32f3257b5a	SUBSCRIPTION_STATUS_ACTIVE
88c027c7-fd15-4bb4-8de9-c1395f010ac9	SUBSCRIPTION_STATUS_ACTIVE
999fa1ae-f959-4ae3-baac-9f147284a43e	SUBSCRIPTION_STATUS_ACTIVE
a20905f1-72f6-49f6-93e3-3757db45038f	SUBSCRIPTION_STATUS_ACTIVE
a8a477c2-004a-4949-a03a-8f8688245c21	SUBSCRIPTION_STATUS_ACTIVE
a981bf8f-2700-44df-b07f-b42b4681927b	SUBSCRIPTION_STATUS_ACTIVE
b0a028e6-261d-4f6b-984f-3050d2f17e46	SUBSCRIPTION_STATUS_ACTIVE
b73e8f31-1ffe-4a99-b772-7b615b7194bd	SUBSCRIPTION_STATUS_ACTIVE
b7d3f27b-7895-49d7-9665-ecb096956398	SUBSCRIPTION_STATUS_ACTIVE
b8061ba4-8fb5-4939-a102-8629567c393d	SUBSCRIPTION_STATUS_ACTIVE
c3fc5d4c-e1f5-4b70-a951-07d18ad9b278	SUBSCRIPTION_STATUS_ACTIVE
ca803992-6d2e-48f9-b7c8-ac7ebe4f4c90	SUBSCRIPTION_STATUS_ACTIVE
cd7f34e4-7e0a-45db-bc0d-275687e9d4c9	SUBSCRIPTION_STATUS_ACTIVE
d2a65edb-7633-4db5-af4b-8f541089c79b	SUBSCRIPTION_STATUS_ACTIVE
d4403e6b-1355-4c1e-ac11-e1f6949c8923	SUBSCRIPTION_STATUS_ACTIVE
d4abdb0f-73f9-4c9f-8b4c-caf41b3a240d	SUBSCRIPTION_STATUS_ACTIVE
d7ba61cd-0538-444a-a864-e1b7a0852ef9	SUBSCRIPTION_STATUS_ACTIVE
d847a6d9-bf9d-4570-8a35-8a2c2e795196	SUBSCRIPTION_STATUS_ACTIVE
ebcf518c-7b9e-4801-aa77-faade71ecd38	SUBSCRIPTION_STATUS_ACTIVE
f27d1571-154d-4e31-948a-384c09e8dd44	SUBSCRIPTION_STATUS_ACTIVE
```
## 3.3 execute.sql generator

```sql
select
	concat(
		"update mosi_subscriptions set state='SUBSCRIPTION_STATUS_DEPROVISIONED', last_modified= now() where subscription_id='", ms.subscription_id, "';"
	) as update_query
from 
	mosi_subscriptions ms 
	inner join company_entitlements ce on ce.id = ms.company_entitlement_id
where 
	ce.external_vendor_identifier != ms.subscription_id
	and ce.external_vendor_identifier is not null
	and ce.status = 'ACTIVE'
	and ms.state = 'SUBSCRIPTION_STATUS_ACTIVE';
```
## 3.4 post-verify.sql

```sql
select 
	ms.subscription_id,
	ms.state
	
from 
	mosi_subscriptions ms 
	inner join company_entitlements ce on ce.id = ms.company_entitlement_id
where 
	ce.external_vendor_identifier != ms.subscription_id
	and ce.external_vendor_identifier is not null
	and ce.status = 'ACTIVE'
	and ms.state = 'SUBSCRIPTION_STATUS_ACTIVE';	

```

## 3.5 post-verify_expected.txt

```sql
subscription_id	state

```

## 3.6 rollback.sql generator

```sql
select
	concat(
		"update mosi_subscriptions set state='",state, "', last_modified='",ms.last_modified, "' where subscription_id='", ms.subscription_id, "';"
	) as update_query
from 
	mosi_subscriptions ms 
	inner join company_entitlements ce on ce.id = ms.company_entitlement_id
where 
	ce.external_vendor_identifier != ms.subscription_id
	and ce.external_vendor_identifier  is not null
	and ce.status = 'ACTIVE'
	and ms.state = 'SUBSCRIPTION_STATUS_ACTIVE';	
```

## 3.7 rollback-verify.sql

```sql
select 
	ms.subscription_id,
	ms.state
	
from 
	mosi_subscriptions ms 
	inner join company_entitlements ce on ce.id = ms.company_entitlement_id
where 
	ce.external_vendor_identifier != ms.subscription_id
	and ce.external_vendor_identifier is not null
	and ce.status = 'ACTIVE'
	and ms.state = 'SUBSCRIPTION_STATUS_ACTIVE';
```
## 3.8 rollback.sql generator
```sql
subscription_id	state
00000000-65da-3cfd-0000-012ebbed66f2	SUBSCRIPTION_STATUS_ACTIVE
01411896-9967-4e4b-a363-91975bf2616f	SUBSCRIPTION_STATUS_ACTIVE
0e7a000d-ed86-4a78-bbdd-c7d583495978	SUBSCRIPTION_STATUS_ACTIVE
1389e2c6-96a3-4730-af8f-8cd7e73e19a8	SUBSCRIPTION_STATUS_ACTIVE
1b0b51a8-7662-4de0-960d-a478c6168818	SUBSCRIPTION_STATUS_ACTIVE
23808ddb-e93f-4a57-93f0-a861ebed3b74	SUBSCRIPTION_STATUS_ACTIVE
2425e3e4-7caa-419e-8f00-11218ae62397	SUBSCRIPTION_STATUS_ACTIVE
31b61908-aa3a-42b3-92c9-600380d334ed	SUBSCRIPTION_STATUS_ACTIVE
331b48ca-e8b7-4668-bec5-135f30d4133a	SUBSCRIPTION_STATUS_ACTIVE
35edfa7a-216a-4894-8cae-b1279fda7a92	SUBSCRIPTION_STATUS_ACTIVE
3910ecd1-4add-4cb2-a7d2-e6201c1ac0d0	SUBSCRIPTION_STATUS_ACTIVE
3c3a9b7a-a94d-4f3a-8491-c46955e1c844	SUBSCRIPTION_STATUS_ACTIVE
40067bea-2d44-4518-996a-032f093964a2	SUBSCRIPTION_STATUS_ACTIVE
43f0c25c-498c-4003-8e23-d9dc15b28474	SUBSCRIPTION_STATUS_ACTIVE
5021ed6c-4deb-4c5b-af00-25ecc75fc184	SUBSCRIPTION_STATUS_ACTIVE
53b7a113-3eca-48b9-b190-58773ae679d1	SUBSCRIPTION_STATUS_ACTIVE
584e2fda-84b9-44f6-b2d5-aeaffb51ca19	SUBSCRIPTION_STATUS_ACTIVE
5c2a01b5-d9e9-4934-8dde-ebbdcab6bcea	SUBSCRIPTION_STATUS_ACTIVE
5ef5164b-7ded-439e-997c-0aae044b3acc	SUBSCRIPTION_STATUS_ACTIVE
63e2632f-4fc2-4881-8d93-4916f4cd6845	SUBSCRIPTION_STATUS_ACTIVE
6b6bc6af-5ae8-47a1-9e37-a9fdf4693ec5	SUBSCRIPTION_STATUS_ACTIVE
71813775-7dbf-4898-8502-05e19758af53	SUBSCRIPTION_STATUS_ACTIVE
724a3e44-a706-4af2-824e-9c4c32d6e9dd	SUBSCRIPTION_STATUS_ACTIVE
732eb927-04d0-433a-a437-42b090cdbe67	SUBSCRIPTION_STATUS_ACTIVE
81be5e87-14a8-4b3f-93d5-9c32f3257b5a	SUBSCRIPTION_STATUS_ACTIVE
88c027c7-fd15-4bb4-8de9-c1395f010ac9	SUBSCRIPTION_STATUS_ACTIVE
999fa1ae-f959-4ae3-baac-9f147284a43e	SUBSCRIPTION_STATUS_ACTIVE
a20905f1-72f6-49f6-93e3-3757db45038f	SUBSCRIPTION_STATUS_ACTIVE
a8a477c2-004a-4949-a03a-8f8688245c21	SUBSCRIPTION_STATUS_ACTIVE
a981bf8f-2700-44df-b07f-b42b4681927b	SUBSCRIPTION_STATUS_ACTIVE
b0a028e6-261d-4f6b-984f-3050d2f17e46	SUBSCRIPTION_STATUS_ACTIVE
b73e8f31-1ffe-4a99-b772-7b615b7194bd	SUBSCRIPTION_STATUS_ACTIVE
b7d3f27b-7895-49d7-9665-ecb096956398	SUBSCRIPTION_STATUS_ACTIVE
b8061ba4-8fb5-4939-a102-8629567c393d	SUBSCRIPTION_STATUS_ACTIVE
c3fc5d4c-e1f5-4b70-a951-07d18ad9b278	SUBSCRIPTION_STATUS_ACTIVE
ca803992-6d2e-48f9-b7c8-ac7ebe4f4c90	SUBSCRIPTION_STATUS_ACTIVE
cd7f34e4-7e0a-45db-bc0d-275687e9d4c9	SUBSCRIPTION_STATUS_ACTIVE
d2a65edb-7633-4db5-af4b-8f541089c79b	SUBSCRIPTION_STATUS_ACTIVE
d4403e6b-1355-4c1e-ac11-e1f6949c8923	SUBSCRIPTION_STATUS_ACTIVE
d4abdb0f-73f9-4c9f-8b4c-caf41b3a240d	SUBSCRIPTION_STATUS_ACTIVE
d7ba61cd-0538-444a-a864-e1b7a0852ef9	SUBSCRIPTION_STATUS_ACTIVE
d847a6d9-bf9d-4570-8a35-8a2c2e795196	SUBSCRIPTION_STATUS_ACTIVE
ebcf518c-7b9e-4801-aa77-faade71ecd38	SUBSCRIPTION_STATUS_ACTIVE
f27d1571-154d-4e31-948a-384c09e8dd44	SUBSCRIPTION_STATUS_ACTIVE
```

# 3 Known issues 
 - Data state is getting updated frequently. In case the DBCM takes time to get excute, data state may get changed and may result in failures.

# 4 Next step 
- Capture corresponding  CREST subscription ids and ask partner to get these cancelled on PC.


# 5 References
- [MSFT-2498](https://appdirect.jira.com/browse/MSFT-2498)