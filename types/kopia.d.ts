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
  status: string,  // TODO: Convert to enum
  upload?: KopiaUploadCounters,
  currentTask: string,
}