import { SMS_CONSENT_TEXT, SMS_DECLINE_TEXT } from "@/lib/sms-consent";

/**
 * Optional SMS preference shared by the Request Coverage and Contact forms: two explicit choices,
 * "No thanks" selected by default, submitted as `smsConsent` = "no" | "yes".
 */
export function SmsChoice({ idPrefix, note }: { idPrefix: string; note: string }) {
  const id = (s: string) => `${idPrefix}${s}`;
  return (
    <fieldset className="field field-full sms-choice" aria-describedby={id("sms-choice-note")}>
      <legend>
        Text messages <span className="optional">(optional)</span>
      </legend>
      <p id={id("sms-choice-note")} className="sms-choice-note">
        {note}
      </p>
      <div className="sms-option">
        <input id={id("sms-no")} name="smsConsent" type="radio" value="no" defaultChecked />
        <label htmlFor={id("sms-no")}>{SMS_DECLINE_TEXT}</label>
      </div>
      <div className="sms-option">
        <input id={id("sms-yes")} name="smsConsent" type="radio" value="yes" />
        <label htmlFor={id("sms-yes")}>{SMS_CONSENT_TEXT}</label>
      </div>
      <p className="consent-links">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms &amp; Conditions</a>
      </p>
    </fieldset>
  );
}
