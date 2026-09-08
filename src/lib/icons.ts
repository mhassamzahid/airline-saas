import {
  IdentificationCard,
  Ticket,
  Wrench,
  ClipboardText,
  ChatCircle,
  Phone,
  Lifebuoy,
  ShieldCheck,
  CurrencyGbp,
  HandWaving,
  Package,
  BookOpen,
} from "@phosphor-icons/react/dist/ssr";

type PhosphorIcon = typeof ChatCircle;

/** Maps the free-text `icon_name` a CMS editor can type into an IconTextLinkBlock
 * back to the actual Phosphor component the frontend renders. */
const ICONS: Record<string, PhosphorIcon> = {
  IdentificationCard,
  Ticket,
  Wrench,
  ClipboardText,
  ChatCircle,
  Phone,
  Lifebuoy,
  ShieldCheck,
  CurrencyGbp,
  HandWaving,
  Package,
  BookOpen,
};

export function resolveIcon(name: string): PhosphorIcon | null {
  return ICONS[name] ?? null;
}
