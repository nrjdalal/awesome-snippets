const schema = z.object({
  url: z
    .string()
    .regex(
      /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.+?)(?<!\/)$/,
    ),
  branch: z
    .string()
    .regex(/^[a-zA-Z0-9.\-_]+$/)
    .optional(),
})
