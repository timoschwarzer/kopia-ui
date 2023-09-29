type ISOString = string

type KopiaStatus = {
  configFile: string,
  connected: boolean,
  description: string,
  hostname: string,
  // TODO: Add missing fields
}

type KopiaDirectorySummary = {
  size: number,
  files: number,
  symlinks: number,
  dirs: number,
  maxTime: number,
  incomplete?: string,
  numFailed: number,
  numIgnoredErrors?: number,
  errors?: KopiaEntryWithError[],
}

type KopiaDirectoryEntry = {
  mode: string,
  mtime: ISOString,
  name: string,
  obj: string,
  size?: number,
  summ?: KopiaDirectorySummary,
  type: 'f' | 'd',
}

type KopiaDirectoryManifest = {
  /**
   * @deprecated
   */
  stream: string,
  entries: KopiaDirectoryEntry[],
  summary: KopiaDirectorySummary,
}

type KopiaSourceInfo = {
  host: string,
  userName: string,
  path: string,
}

type KopiaSnapshotStats = {
  totalSize: number,
  excludedTotalSize: number,
  fileCount: number,
  cachedFiles: number,
  nonCachedFiles: number,
  dirCount: number,
  excludedFileCount: number,
  excludedDirCount: number,
  ignoredErrorCount: number,
  errorCount: number,
}

type KopiaStorageUsageDetails = {
  objectBytes: number,
  originalContentBytes: number,
  packedContentBytes: number,
  fileObjects: number,
  dirObjects: number,
  contents: number,
}

type KopiaStorageStats = {
  newData?: KopiaStorageUsageDetails,
  runningTotal?: KopiaStorageUsageDetails,
}

type KopiaSnapshotManifest = {
  description: string,
  startTime: ISOString,
  endTime: ISOString,
  id: string,
  rootEntry: KopiaDirectoryEntry,
  stats?: KopiaSnapshotStats,
  incomplete?: string,
  tags?: { [tagName: string]: string },
  storageStats?: KopiaStorageStats,
  ping?: string[],
}

type KopiaEntryWithError = {
  path: string,
  error: string,
}

type KopiaSnapshot = {
  id: string,
  description: string,
  startTime: ISOString,
  endTime: ISOString,
  incomplete: string,
  summary: KopiaDirectorySummary,
  rootID: string,
  retention: string[],
  pins: string[],
}

type KopiaTimeOfDay = {
  hour: number,
  minute: number,
}

type KopiaSchedulingPolicy = {
  intervalSeconds?: number,
  timesOfDay?: KopiaTimeOfDay[],
  noParentTimesOfDay?: boolean,
  manual?: boolean,
  cron?: string[],
}

type KopiaUploadCounters = {
  cachedBytes: number,
  hashedBytes: number,
  uploadedBytes: number,
  estimatedBytes: number,
  cachedFiles: number,
  hashedFiles: number,
  excludedFiles: number,
  excludedDirs: number,
  errors: number,
  ignoredErrors: number,
  estimatedFiles: number,
  directory: string,
  lastErrorPath: string,
  lastError: string,
}

type KopiaSourceStatus = {
  lastSnapshot?: KopiaSnapshotManifest,
  nextSnapshotTime?: ISOString,
  schedule: string,
  source: KopiaSourceInfo,
  status: 'IDLE' | 'UPLOADING',  // TODO: Possibly more...
  upload?: KopiaUploadCounters,
  currentTask: string,
}

type KopiaRetentionPolicy = {
  keepLatest?: number,
  keepHourly?: number,
  keepDaily?: number,
  keepWeekly?: number,
  keepMonthly?: number,
  keepAnnual?: number,
  ignoreIdenticalSnapshots?: boolean,
}

type KopiaFilesPolicy = {
  ignoreRules?: string[],
  noParentIgnore?: boolean,
  ignoreDotFiles?: string[],
  noParentDotFiles?: boolean,
  ignoreCacheDirs?: boolean,
  maxFileSize?: number,
  oneFileSystem?: boolean,
}

type KopiaErrorHandlingPolicy = {
  ignoreFileErrors?: boolean,
  ignoreDirectoryErrors?: boolean,
  ignoreUnknownTypes?: boolean,
}

type KopiaCompressionPolicy = {
  compressorName?: string,
  onlyCompress?: string[]
  noParentOnlyCompress?: boolean,
  neverCompress?: string[],
  noParentNeverCompress?: boolean,
  minSize?: number,
  maxSize?: number,
}

type KopiaActionCommand = {
  path?: string,
  args?: string[],
  script?: string,
  timeout?: number,
  mode?: 'essential' | 'optional' | 'async',
}

type KopiaActionsPolicy = {
  beforeFolder?: KopiaActionCommand,
  afterFolder?: KopiaActionCommand,
  beforeSnapshotRoot?: KopiaActionCommand,
  afterSnapshotRoot?: KopiaActionCommand,
}

enum KopiaLogDetail {
  None = 0,
  Normal = 5,
  Max = 10,
}

type KopiaDirLoggingPolicy = {
  snapshotted?: KopiaLogDetail,
  ignored?: KopiaLogDetail,
}

type KopiaEntryLoggingPolicy = {
  snapshotted?: KopiaLogDetail,
  ignored?: KopiaLogDetail,
  cacheHit?: KopiaLogDetail,
  cacheMiss?: KopiaLogDetail,
}

type KopiaLoggingPolicy = {
  directories?: KopiaDirLoggingPolicy,
  entries?: KopiaEntryLoggingPolicy,
}

type KopiaUploadPolicy = {
  maxParallelSnapshots?: number,
  maxParallelFileReads?: number,
  parallelUploadAboveSize?: number,
}

type KopiaPolicy = {
  retention?: KopiaRetentionPolicy,
  files?: KopiaFilesPolicy,
  errorHandling?: KopiaErrorHandlingPolicy,
  scheduling?: KopiaSchedulingPolicy,
  compression?: KopiaCompressionPolicy,
  actions?: KopiaActionsPolicy,
  logging?: KopiaLoggingPolicy,
  upload?: KopiaUploadPolicy,
  noParent?: boolean,
}