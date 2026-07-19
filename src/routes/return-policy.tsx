import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/return-policy")({
  component: () => (
    <LegalPage title="Return Policy" updated="July 2026" sections={[
      { h: "Returns window", p: "Unfortunately we do not have a return policy for now" }
      { h: "Non-returnable items", p: "For hygiene reasons, opened or used skincare products cannot be returned unless they arrived damaged or defective." }
      { h: "Defective or Damage Items", p: "Reach out to our team with photos of products and they will guide you" },
    ]} />
  ),
  head: () => ({ meta: [{ title: "Return Policy — STfresh" }, { property: "og:url", content: "/return-policy" }], links: [{ rel: "canonical", href: "/return-policy" }] }),
});
