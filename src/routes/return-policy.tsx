import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/return-policy")({
  component: () => (
    <LegalPage title="Return Policy" updated="July 2026"sections={[
  {
    h: "Returns Window",
    p: "Unfortunately, we do not have a return policy at the moment."
  },
  {
    h: "Non-returnable Items",
    p: "For hygiene reasons, opened or used skincare products cannot be returned unless they arrived damaged or defective."
  },
  {
    h: "Defective or Damaged Items",
    p: "Reach out to our team with photos of the product, and our support team will guide you through the resolution process."
  },
]} />
  ),
  head: () => ({ meta: [{ title: "Return Policy — STfresh" }, { property: "og:url", content: "/return-policy" }], links: [{ rel: "canonical", href: "/return-policy" }] }),
});
