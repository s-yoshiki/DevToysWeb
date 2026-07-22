import type { ToolDefinition } from '../domain/catalog'

/** Every workspace receives the catalog entry that selected it. */
export type WorkspaceProps = { tool: ToolDefinition }

/** Discriminator stored on a catalog entry; `default` is the converter shell. */
export type WorkspaceKey = NonNullable<ToolDefinition['workspace']>
