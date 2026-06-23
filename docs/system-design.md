# Ranch Ledger System Design

This document describes how Ranch Ledger is organized as software.

## Core System Concept

Ranch Ledger is made of separate modules that share one ranch-scoped database.

The main modules are:

- Ranch Administration
- Operations
- Field App
- Reports

## Ranch Administration Module

Purpose:

Configure and manage the ranch.

Responsibilities:

- Ranch profile
- Users
- Employees
- Guests
- Reservations
- Horses
- Trails
- Basic setup

Primary user:

- Ranch Administrator

## Operations Module

Purpose:

Run the day.

Responsibilities:

- Today's Operations
- Activity planning
- Guest assignment
- Horse assignment
- Wrangler assignment
- Assignment warnings
- Activity status tracking

Primary user:

- Head Wrangler

## Field App Module

Purpose:

Support staff in the field.

Responsibilities:

- View today's assignment
- View assigned guests
- View assigned horses
- View route/map
- Start/complete activity
- Emergency beacon
- Live GPS sharing

Primary user:

- Wrangler

## Reports Module

Purpose:

Review history and performance.

Responsibilities:

- Guest activity history
- Horse usage
- Trail usage
- Employee workload
- Incident history

Primary users:

- Ranch Administrator
- Head Wrangler

## Design Rule

Configuration belongs in Ranch Administration.

Daily decision-making belongs in Operations.

Field execution belongs in the Field App.

Reporting belongs in Reports.