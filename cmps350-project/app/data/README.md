# CS Curriculum JSON Structure - README

This file explains the structure and usage of the CS curriculum JSON data for the student management platform.

## JSON Structure

Each course in the curriculum is represented as a JSON object with the following properties:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique identifier following the pattern: `NNXXX` where NN is the category code and XXX is the course number |
| `code` | String | Course code displayed in the UI (e.g., "CS 101") |
| `name` | String | Full name of the course |
| `credits` | Number | Credit hours for the course (typically 3-6) |
| `category` | String | Course category/subject area |
| `prerequisites` | Array | List of course IDs that must be completed before taking this course |
| `description` | String | Detailed course description |
| `status` | String | Current course status ("Open", "Closed") |
| `registrationOpen` | Boolean | Whether registration is currently available |
| `instructor` | String | Name of the course instructor |
| `enrolled` | Number | Current number of enrolled students |

## Category Codes

The first two digits of the course ID represent the category:

| Code | Category | Description |
|------|----------|-------------|
| 01 | Programming | Core programming concepts, algorithms, and languages |
| 02 | Mathematics | Mathematical foundations for computer science |
| 03 | Systems | Hardware, operating systems, networks, and security |
| 04 | Web & Data | Web development, databases, and data science |
| 05 | AI & Advanced Tech | AI, machine learning, and emerging technologies |
| 06 | Software Engineering | Project management, development processes, and professional skills |

## Course Numbering

- 1XX: First-year courses (no prerequisites)
- 2XX: Second-year courses (typically require 1XX courses)
- 3XX: Third-year courses (require 1XX and/or 2XX courses)
- 4XX: Fourth-year courses (require multiple prerequisites, often including 3XX courses)

## Prerequisites

Prerequisites are stored as an array of course IDs. Empty array (`[]`) indicates no prerequisites.

## Notes

- The curriculum provides comprehensive coverage of computer science fundamentals and advanced topics
- Each category has courses spread across multiple years to build expertise progressively
- The standard course load is 5 courses per year, with the fourth year including a capstone project
- *This README was generated with AI*