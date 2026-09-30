import type {
  ProductionMode,
  ProductionStatus,
  CloudinaryStatus,
  QC1Status,
  CampaignStatus,
  QC2Status,
  OverallStatus,
  BufferStatus,
} from "../types";

export function ProductionModeBadge({ mode }: { mode: ProductionMode }) {
  const styles: Record<ProductionMode, string> = {
    AUTO: "badge-success",
    "SEMI-AUTO": "badge-info",
    MANUAL: "badge-warning",
    "NOT AVAILABLE": "badge-error",
  };
  return <span className={styles[mode]}>{mode}</span>;
}

export function ProductionStatusBadge({
  status,
}: {
  status: ProductionStatus;
}) {
  const styles: Record<ProductionStatus, string> = {
    pending: "badge-neutral",
    in_production: "badge-info",
    result_ready: "badge-accent",
    registered: "badge-info",
    qc1_pending: "badge-warning",
    qc1_passed: "badge-success",
    qc1_failed: "badge-error",
    master_stored: "badge-success",
  };
  const labels: Record<ProductionStatus, string> = {
    pending: "Pending",
    in_production: "In Production",
    result_ready: "Result Ready",
    registered: "Registered",
    qc1_pending: "QC-1 Pending",
    qc1_passed: "QC-1 Passed",
    qc1_failed: "QC-1 Failed",
    master_stored: "Master Stored",
  };
  return <span className={styles[status]}>{labels[status]}</span>;
}

export function CloudinaryStatusBadge({
  status,
}: {
  status: CloudinaryStatus;
}) {
  const styles: Record<CloudinaryStatus, string> = {
    not_stored: "badge-neutral",
    pending: "badge-warning",
    stored: "badge-success",
    error: "badge-error",
  };
  const labels: Record<CloudinaryStatus, string> = {
    not_stored: "Not Stored",
    pending: "Pending",
    stored: "Stored",
    error: "Error",
  };
  return <span className={styles[status]}>{labels[status]}</span>;
}

export function QC1Badge({ status }: { status: QC1Status }) {
  const styles: Record<QC1Status, string> = {
    pending: "badge-warning",
    passed: "badge-success",
    failed: "badge-error",
  };
  const labels: Record<QC1Status, string> = {
    pending: "QC-1 Pending",
    passed: "QC-1 Passed",
    failed: "QC-1 Failed",
  };
  return <span className={styles[status]}>{labels[status]}</span>;
}

export function OverallStatusBadge({ status }: { status: OverallStatus }) {
  const styles: Record<OverallStatus, string> = {
    draft: "badge-neutral",
    in_production: "badge-info",
    qc1_pending: "badge-warning",
    master_stored: "badge-success",
    archived: "badge-neutral",
  };
  const labels: Record<OverallStatus, string> = {
    draft: "Draft",
    in_production: "In Production",
    qc1_pending: "QC-1 Pending",
    master_stored: "Master Stored",
    archived: "Archived",
  };
  return <span className={styles[status]}>{labels[status]}</span>;
}

export function CampaignStatusBadge({
  status,
}: {
  status: CampaignStatus;
}) {
  const styles: Record<CampaignStatus, string> = {
    draft: "badge-neutral",
    preview: "badge-info",
    qc2_pending: "badge-warning",
    approved: "badge-success",
    scheduled: "badge-accent",
    distributing: "badge-info",
    completed: "badge-success",
    rejected: "badge-error",
  };
  const labels: Record<CampaignStatus, string> = {
    draft: "Draft",
    preview: "Preview",
    qc2_pending: "QC-2 Pending",
    approved: "Approved",
    scheduled: "Scheduled",
    distributing: "Distributing",
    completed: "Completed",
    rejected: "Rejected",
  };
  return <span className={styles[status]}>{labels[status]}</span>;
}

export function QC2Badge({ status }: { status: QC2Status }) {
  const styles: Record<QC2Status, string> = {
    pending: "badge-warning",
    passed: "badge-success",
    failed: "badge-error",
  };
  const labels: Record<QC2Status, string> = {
    pending: "QC-2 Pending",
    passed: "QC-2 Passed",
    failed: "QC-2 Failed",
  };
  return <span className={styles[status]}>{labels[status]}</span>;
}

export function BufferStatusBadge({ status }: { status: BufferStatus }) {
  const styles: Record<BufferStatus, string> = {
    not_scheduled: "badge-neutral",
    scheduled: "badge-accent",
    distributed: "badge-success",
    error: "badge-error",
  };
  const labels: Record<BufferStatus, string> = {
    not_scheduled: "Not Scheduled",
    scheduled: "Scheduled",
    distributed: "Distributed",
    error: "Error",
  };
  return <span className={styles[status]}>{labels[status]}</span>;
}
