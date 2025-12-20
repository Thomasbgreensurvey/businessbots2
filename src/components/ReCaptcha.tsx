import ReCAPTCHA from "react-google-recaptcha";
import { forwardRef, useImperativeHandle, useRef } from "react";

// This is a test key for development - replace with your production site key
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

export interface ReCaptchaRef {
  reset: () => void;
  getValue: () => string | null;
}

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
  onExpired?: () => void;
  className?: string;
}

const ReCaptcha = forwardRef<ReCaptchaRef, ReCaptchaProps>(
  ({ onChange, onExpired, className }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        recaptchaRef.current?.reset();
      },
      getValue: () => {
        return recaptchaRef.current?.getValue() ?? null;
      },
    }));

    return (
      <div className={className}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={onChange}
          onExpired={onExpired}
          theme="light"
          size="normal"
        />
        <p className="text-xs text-gray-500 mt-2">
          This site is protected by reCAPTCHA and the Google{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700"
          >
            Terms of Service
          </a>{" "}
          apply.
        </p>
      </div>
    );
  }
);

ReCaptcha.displayName = "ReCaptcha";

export default ReCaptcha;
