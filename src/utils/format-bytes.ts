export default function formatBytes(size: number) {
  if (size <= 1024) {
    return `${size} Bytes`;
  }
  if (size <= 1024 * 1024) {
    return `${(size / 1024).toPrecision(3)} KB`;
  }
  return `${(size / (1024 * 1024)).toPrecision(3)} MB`;
}
