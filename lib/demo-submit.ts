// lib/demo-submit.ts
import type { DemoRequest } from '@/lib/demo-form';

/**
 * Stub, like the contact form: nothing leaves the browser. Replace the body with a call to the
 * lead endpoint (open item 2 in the spec) and keep the signature so the form does not change.
 */
export async function submitDemoRequest(request: DemoRequest): Promise<void> {
  void request;
  await new Promise((resolve) => setTimeout(resolve, 600));
}
