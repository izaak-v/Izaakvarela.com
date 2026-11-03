/**
 * Optional SMS opt-in (A2P 10DLC), shared by the Request Coverage and Contact forms.
 *
 * Each form offers two explicit choices: SMS_DECLINE_TEXT, selected by default, and the affirmative
 * SMS_CONSENT_TEXT, which the visitor must choose. Shown verbatim, followed by links to /privacy and
 * /terms, and recorded with the submission when chosen. Never required to submit.
 */
export const SMS_CONSENT_TEXT =
  "Yes, I agree to receive recurring text messages from Izaak Varela regarding my insurance inquiry, coverage options, appointment scheduling and reminders, and follow-up. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for assistance. Consent is not a condition of purchase.";

/** The explicit "decline texts" choice (default). Each form works the same either way. */
export const SMS_DECLINE_TEXT = "No thanks, continue without text messages.";

/** Only an affirmative choice counts; "no", a missing value or anything else is no SMS consent. */
export function isSmsOptIn(value: unknown): boolean {
  return value === true || value === "yes" || value === "on" || value === "true";
}

/** Same rule as ProducerOS: 10 digits (optional leading 1); area code and exchange can't start with 0 or 1. */
export function isUsPhone(input: string): boolean {
  if (!/^[0-9()+\-.\s]{10,30}$/.test(input)) return false;
  let digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 && !/^[01]/.test(digits) && !/^[01]/.test(digits.slice(3));
}
