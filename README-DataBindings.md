
# DocFlow AI – Dual-Portal Data Bindings

## Overview
This document lists all the dynamic placeholder IDs used throughout the DocFlow AI dual-portal experience. These IDs can be used to bind real-time data from your backend systems.

## Global Placeholder IDs

### User Identifiers
- `{{USER_NAME}}` - Display name of the current user
- `{{ADMIN_NAME}}` - Display name of the current admin user

### System Metrics
- `{{DOC_COUNT}}` - Total number of documents processed across the system
- `{{AVG_LATENCY_MS}}` - Average processing latency in milliseconds
- `{{SUCCESS_RATE}}` - Overall system success rate percentage (0-100)

### Document Processing
- `{{PROCESSING_COUNT}}` - Number of documents currently being processed
- `{{FAILED_COUNT}}` - Number of failed documents/processing events
- `{{QUEUE_DEPTH}}` - Current processing queue depth

## User Dashboard Specific

### Upload Statistics
- `{{USER_DOC_COUNT}}` - Number of documents uploaded by current user
- `{{USER_SUCCESS_RATE}}` - Success rate for current user's documents

### Pipeline Status
- `{{PIPELINE_STEP}}` - Current pipeline step (0-3: Ingested, Extracted, Classified, Routed)
- `{{LAST_PROCESSED}}` - Timestamp of last processed document
- `{{OCR_TIME}}` - OCR processing time for current document

## Admin Dashboard Specific

### System Health
- `{{CPU_USAGE}}` - Current CPU usage percentage
- `{{MEMORY_USAGE}}` - Current memory usage percentage
- `{{DISK_USAGE}}` - Current disk usage percentage
- `{{UPTIME}}` - System uptime

### Agent Metrics
- `{{INGESTOR_STATUS}}` - Status of the Ingestor agent
- `{{EXTRACTOR_STATUS}}` - Status of the Extractor agent
- `{{CLASSIFIER_STATUS}}` - Status of the Classifier agent
- `{{ROUTER_STATUS}}` - Status of the Router agent

### Analytics
- `{{ERROR_RATE}}` - Current error rate percentage
- `{{THROUGHPUT}}` - Documents processed per hour
- `{{PEAK_HOURS}}` - Peak processing hours

## Implementation Notes

### Frontend Integration
Replace these placeholders in your React components:
```jsx
// Example usage
const totalDocs = "{{DOC_COUNT}}"; // Replace with actual data
const avgLatency = "{{AVG_LATENCY_MS}}"; // Replace with actual data
```

### Backend Data Sources
These metrics can be sourced from:
- Database queries for document counts and processing statistics
- System monitoring tools for performance metrics
- Agent health checks for status indicators
- Analytics platforms for user behavior data

### Real-time Updates
Consider implementing:
- WebSocket connections for real-time metric updates
- Server-sent events for live dashboard updates
- Polling intervals for less critical metrics
- Caching strategies for frequently accessed data

## Color Coding System

### Status Colors
- **Success/Healthy**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Yellow/Orange)
- **Error/Failed**: `#EF4444` (Red)
- **Processing**: `#3B82F6` (Blue)
- **Info**: `#00E3FF` (Cyan - Brand Color)

### Brand Colors
- **Primary**: `#5E2BFF` (Purple)
- **Secondary**: `#00E3FF` (Cyan)
- **Background Dark**: `#0F1224`
- **Background Light**: `#F7F9FB`

## Data Refresh Intervals

### Recommended Update Frequencies
- **Real-time metrics** (CPU, Memory): 1-3 seconds
- **Processing pipeline**: 5-10 seconds
- **Document counts**: 30 seconds
- **Analytics data**: 5-15 minutes
- **Historical reports**: 1-24 hours

## Security Considerations

### Data Access
- Ensure proper authentication for all metric endpoints
- Implement role-based access control for sensitive metrics
- Use secure API keys for backend integrations
- Log all data access for audit purposes

### Privacy
- Anonymize user-specific data where appropriate
- Implement data retention policies
- Ensure GDPR/compliance requirements are met
- Provide user consent mechanisms where required
