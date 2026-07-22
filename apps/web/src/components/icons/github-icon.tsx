/**
 * lucide-react dropped brand marks in v1, so the GitHub logo ships as a local
 * component. Sized and coloured like a lucide icon (`size-*` / `currentColor`).
 */
export const GithubIcon = ({ className, ...props }: React.ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={className}
    {...props}
  >
    <path d="M12 .5C5.73.5.63 5.6.63 11.88c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55l-.02-1.93c-3.16.69-3.83-1.52-3.83-1.52-.52-1.31-1.26-1.66-1.26-1.66-1.03-.71.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.66 1.24 3.31.95.1-.74.4-1.24.72-1.53-2.52-.29-5.17-1.26-5.17-5.62 0-1.24.44-2.26 1.17-3.05-.12-.29-.51-1.45.11-3.02 0 0 .95-.31 3.12 1.16a10.8 10.8 0 0 1 5.68 0c2.17-1.47 3.12-1.16 3.12-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.81 1.17 3.05 0 4.37-2.66 5.33-5.19 5.61.41.35.77 1.05.77 2.12l-.01 3.14c0 .3.2.66.79.55a11.27 11.27 0 0 0 7.77-10.78C23.37 5.6 18.27.5 12 .5Z" />
  </svg>
)
