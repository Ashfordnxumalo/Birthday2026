import { config } from "../../config.js";

export async function shareInvite() {
  const shareData = {
    title: `${config.honoreeName}'s ${config.milestone}`,
    text: `You're invited to ${config.honoreeName}'s black-tie celebration on ${config.displayDate}.`,
    url: config.siteUrl,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return { method: "share" };
    } catch {
      return { method: "cancelled" };
    }
  }

  try {
    await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    return { method: "clipboard" };
  } catch {
    return { method: "error" };
  }
}
