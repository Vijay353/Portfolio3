import type { Para as ParaData } from "@/content/types";
import { isVisible, paraText, paraVerify } from "@/lib/review";
import { ReviewNote } from "./ReviewNote";

/** Renders a content paragraph and its [verify] note (review mode only). Filter with visibleParas first. */
export function ParaText({ para }: { para: ParaData }) {
  if (!isVisible(para)) return null;
  const verify = paraVerify(para);
  return (
    <>
      {paraText(para)}
      {verify ? <ReviewNote kind="verify">{verify}</ReviewNote> : null}
    </>
  );
}
