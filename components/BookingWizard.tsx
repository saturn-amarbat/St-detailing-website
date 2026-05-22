"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CalendarClock, Car, Check, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  addons,
  bookingSchema,
  calculateTotal,
  encodeNetlifyForm,
  getPackage,
  getVehicleSize,
  packages,
  vehicleSizes,
  type AddonId,
  type BookingFormValues,
  type PackageId
} from "@/lib/booking";
import { businessEmail, messengerUrl } from "@/lib/contact";

const formName = "booking-wizard";

const stepFields: Record<number, (keyof BookingFormValues)[]> = {
  0: ["vehicleSize"],
  1: ["selectedPackage"],
  2: ["addons"],
  3: ["firstName", "lastName", "email", "phone", "preferredDate", "preferredTime", "calculatedTotal"]
};

const packageHashMap = new Map(packages.map((servicePackage) => [`#quote-${servicePackage.id}`, servicePackage.id]));

function getDefaultValues(selectedPackage: PackageId = "resale-restoration"): BookingFormValues {
  return {
    vehicleSize: "sedan-coupe",
    selectedPackage,
    addons: [],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    calculatedTotal: calculateTotal("sedan-coupe", selectedPackage, [])
  };
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    reset,
    clearErrors,
    formState: { errors, touchedFields, submitCount }
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onTouched",
    reValidateMode: "onBlur",
    defaultValues: getDefaultValues()
  });

  const vehicleSize = useWatch({ control, name: "vehicleSize" });
  const selectedPackage = useWatch({ control, name: "selectedPackage" });
  const selectedAddons = useWatch({ control, name: "addons" });
  const activeAddons = useMemo(() => selectedAddons ?? [], [selectedAddons]);
  const total = useMemo(
    () => calculateTotal(vehicleSize, selectedPackage, activeAddons),
    [vehicleSize, selectedPackage, activeAddons]
  );

  const vehicle = useMemo(() => getVehicleSize(vehicleSize), [vehicleSize]);
  const servicePackage = useMemo(() => getPackage(selectedPackage), [selectedPackage]);
  const addonTotal = useMemo(
    () =>
    activeAddons.reduce((sum, addonId) => {
        const addon = addons.find((item) => item.id === addonId);
        return sum + (addon?.price ?? 0);
      }, 0),
    [activeAddons]
  );

  useEffect(() => {
    setValue("calculatedTotal", total, { shouldValidate: true });
  }, [setValue, total]);

  const resetWizard = useCallback((packageId: PackageId = "resale-restoration") => {
    reset(getDefaultValues(packageId));
    clearErrors();
    setStatus("idle");
    setSubmitError("");
    setStep(0);
  }, [clearErrors, reset]);

  const scrollToWizard = useCallback(() => {
    window.requestAnimationFrame(() => {
      document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const openWizard = useCallback((packageId?: PackageId) => {
    resetWizard(packageId);
    scrollToWizard();
  }, [resetWizard, scrollToWizard]);

  useEffect(() => {
    const syncPackageFromHash = () => {
      const packageId = packageHashMap.get(window.location.hash) as PackageId | undefined;
      if (packageId) {
        openWizard(packageId);
      }
    };

    const handleQuoteClick = (event: globalThis.MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#quote"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const packageId = packageHashMap.get(href) as PackageId | undefined;
      event.preventDefault();

      if (window.location.hash !== href) {
        window.history.pushState(null, "", href);
      }

      openWizard(packageId);
    };

    syncPackageFromHash();
    document.addEventListener("click", handleQuoteClick);
    window.addEventListener("hashchange", syncPackageFromHash);
    return () => {
      document.removeEventListener("click", handleQuoteClick);
      window.removeEventListener("hashchange", syncPackageFromHash);
    };
  }, [openWizard]);

  const showFieldError = (field: keyof BookingFormValues) => {
    return Boolean(errors[field] && (touchedFields[field] || submitCount > 0));
  };

  const setVehicleSize = (value: BookingFormValues["vehicleSize"]) => {
    setValue("vehicleSize", value, { shouldDirty: true, shouldValidate: true });
  };

  const setPackage = (value: BookingFormValues["selectedPackage"]) => {
    setValue("selectedPackage", value, { shouldDirty: true, shouldValidate: true });
  };

  const toggleAddon = (addonId: AddonId) => {
    const nextAddons = activeAddons.includes(addonId)
      ? activeAddons.filter((item) => item !== addonId)
      : [...activeAddons, addonId];
    setValue("addons", nextAddons, { shouldDirty: true, shouldValidate: true });
  };

  const goNext = async () => {
    const isValid = await trigger(stepFields[step], { shouldFocus: true });
    if (isValid) {
      setStep((current) => Math.min(current + 1, 3));
    }
  };

  const onSubmit = async (values: BookingFormValues) => {
    const calculatedTotal = calculateTotal(values.vehicleSize, values.selectedPackage, values.addons);
    const selectedVehicle = getVehicleSize(values.vehicleSize);
    const selectedService = getPackage(values.selectedPackage);
    const selectedAddonDetails = values.addons.map((addonId) => addons.find((addon) => addon.id === addonId)).filter(Boolean);
    const pricing = {
      basePrice: selectedService.basePrice,
      vehicleAdjustment: selectedVehicle.adjustment,
      addonTotal: selectedAddonDetails.reduce((sum, addon) => sum + (addon?.price ?? 0), 0),
      calculatedTotal
    };
    const payload = {
      vehicleSize: {
        id: selectedVehicle.id,
        label: selectedVehicle.label,
        adjustment: selectedVehicle.adjustment
      },
      selectedPackage: {
        id: selectedService.id,
        name: selectedService.name,
        basePrice: selectedService.basePrice
      },
      addons: selectedAddonDetails.map((addon) => ({
        id: addon?.id,
        name: addon?.name,
        price: addon?.price
      })),
      pricing,
      customer: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone
      },
      preferredDateTime: {
        date: values.preferredDate,
        time: values.preferredTime
      }
    };

    setStatus("submitting");
    setSubmitError("");

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeNetlifyForm({
          "form-name": formName,
          "bot-field": "",
          vehicleSize: selectedVehicle.label,
          selectedPackage: selectedService.name,
          addons: JSON.stringify(payload.addons),
          calculatedTotal: String(calculatedTotal),
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          preferredDate: values.preferredDate,
          preferredTime: values.preferredTime,
          payload: JSON.stringify(payload)
        })
      });

      if (!response.ok) {
        throw new Error("The request could not be submitted.");
      }

      setStatus("success");
      reset(getDefaultValues());
      setStep(0);
    } catch {
      setStatus("error");
      setSubmitError("Something went wrong while submitting your request.");
    }
  };

  return (
    <section id="quote" className="relative overflow-hidden bg-slate-950 py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(8,145,178,0.22),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(37,99,235,0.2),transparent_30%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
            Get a free quote
          </span>
          <h2 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Build your mobile detail in under a minute.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-zinc-300">
            Select your vehicle size, choose a package, add any problem-specific services, and send a clean quote request directly to ST Chicagoland Mobile Detailing.
          </p>
          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-glass">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-400" aria-hidden="true" />
              <p className="text-sm font-bold text-white">Estimate before inspection</p>
            </div>
            <p className="mt-3 text-sm text-zinc-300">
              Final quotes may vary for heavy staining, excessive debris, paint condition, or unusual vehicle conditions.
            </p>
          </div>
        </div>

        <form
          name={formName}
          method="POST"
          action="/"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-glass backdrop-blur sm:p-6"
        >
          <input type="hidden" name="form-name" value={formName} />
          <p className="hidden">
            <label>
              Do not fill this out: <input name="bot-field" />
            </label>
          </p>
          <input type="hidden" {...register("vehicleSize")} />
          <input type="hidden" {...register("selectedPackage")} />
          <input type="hidden" {...register("calculatedTotal", { valueAsNumber: true })} />

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-cyan-300">Step {step + 1} of 4</p>
              <h3 className="mt-1 text-2xl font-black text-white">
                {["Select vehicle size", "Select package", "Add-ons", "Contact details"][step]}
              </h3>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current estimate</p>
              <p className="text-3xl font-black text-cyan-300">{currency(total)}</p>
              <p className="mt-1 text-xs font-bold text-zinc-400">{servicePackage.name}</p>
            </div>
          </div>

          <div className="mt-6">
            {step === 0 ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {vehicleSizes.map((option) => {
                  const active = vehicleSize === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setVehicleSize(option.id)}
                      className={cx(
                        "rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950",
                        active
                          ? "border-cyan-300/60 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 shadow-glow ring-2 ring-cyan-300/60"
                          : "border-white/10 bg-white/[0.04] hover:border-cyan-300/35 hover:bg-white/[0.07]"
                      )}
                    >
                      <Car className={cx("h-7 w-7", active ? "text-cyan-300" : "text-zinc-400")} aria-hidden="true" />
                      <p className="mt-4 text-lg font-black text-white">{option.label}</p>
                      <p className="mt-2 text-sm text-zinc-300">{option.description}</p>
                      <p className="mt-4 text-sm font-black text-cyan-300">
                        {option.adjustment === 0 ? "Base price" : `+${currency(option.adjustment)}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-4">
                {packages.map((option) => {
                  const active = selectedPackage === option.id;
                  const packageTotal = option.basePrice + vehicle.adjustment + addonTotal;
                  return (
                    <button
                      key={option.id}
                      id={`quote-${option.id}`}
                      type="button"
                      onClick={() => setPackage(option.id)}
                      className={cx(
                        "grid gap-4 rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:grid-cols-[1fr_auto] sm:items-start",
                        active
                          ? "border-cyan-300/60 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 shadow-glow"
                          : "border-white/10 bg-white/[0.04] hover:border-cyan-300/35 hover:bg-white/[0.07]"
                      )}
                    >
                      <span>
                        {option.featured ? (
                          <span className="mb-3 mr-2 inline-flex rounded-full bg-cyan-900/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
                            Best Seller
                          </span>
                        ) : null}
                        {active ? (
                          <span className="mb-3 inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-200">
                            Selected
                          </span>
                        ) : null}
                        <span className="block text-2xl font-black text-white">{option.name}</span>
                        <span className="mt-2 block text-sm text-zinc-300">{option.description}</span>
                        <span className="mt-4 grid gap-2 text-sm font-semibold text-zinc-100 sm:grid-cols-2">
                          {option.features.map((feature) => (
                            <span key={feature} className="flex gap-2">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                              {feature}
                            </span>
                          ))}
                        </span>
                      </span>
                      <span className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left sm:text-right">
                        <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400">{vehicle.shortLabel} estimate</span>
                        <span className="mt-1 block text-3xl font-black text-cyan-300">{currency(packageTotal)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-4">
                {addons.map((addon) => {
                  const active = activeAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={cx(
                        "flex items-center justify-between gap-4 rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950",
                        active
                          ? "border-cyan-300/60 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 shadow-glow"
                          : "border-white/10 bg-white/[0.04] hover:border-cyan-300/35 hover:bg-white/[0.07]"
                      )}
                    >
                      <span>
                        <span className="block text-lg font-black text-white">{addon.name}</span>
                        <span className="mt-1 block text-sm text-zinc-300">{addon.description}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        <span className="text-sm font-black text-cyan-300">+{currency(addon.price)}</span>
                        <span
                          className={cx(
                            "flex h-7 w-12 items-center rounded-full border p-1 transition",
                            active ? "border-cyan-300 bg-cyan-400/25" : "border-white/10 bg-slate-950"
                          )}
                        >
                          <span className={cx("h-5 w-5 rounded-full transition", active ? "translate-x-5 bg-cyan-300" : "bg-zinc-500")} />
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-zinc-200">First name</span>
                    <input
                      {...register("firstName")}
                      className="min-h-12 rounded-xl border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-300"
                      autoComplete="given-name"
                    />
                    {showFieldError("firstName") ? <span className="text-sm text-red-300">{errors.firstName?.message}</span> : null}
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-zinc-200">Last name</span>
                    <input
                      {...register("lastName")}
                      className="min-h-12 rounded-xl border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-300"
                      autoComplete="family-name"
                    />
                    {showFieldError("lastName") ? <span className="text-sm text-red-300">{errors.lastName?.message}</span> : null}
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-zinc-200">Email</span>
                    <input
                      {...register("email")}
                      type="email"
                      className="min-h-12 rounded-xl border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-300"
                      autoComplete="email"
                    />
                    {showFieldError("email") ? <span className="text-sm text-red-300">{errors.email?.message}</span> : null}
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-zinc-200">Phone</span>
                    <input
                      {...register("phone")}
                      type="tel"
                      className="min-h-12 rounded-xl border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-300"
                      autoComplete="tel"
                    />
                    {showFieldError("phone") ? <span className="text-sm text-red-300">{errors.phone?.message}</span> : null}
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-zinc-200">Preferred date</span>
                    <input
                      {...register("preferredDate")}
                      type="date"
                      className="min-h-12 rounded-xl border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition focus:border-cyan-300"
                    />
                    {showFieldError("preferredDate") ? <span className="text-sm text-red-300">{errors.preferredDate?.message}</span> : null}
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-zinc-200">Preferred time</span>
                    <input
                      {...register("preferredTime")}
                      type="time"
                      className="min-h-12 rounded-xl border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition focus:border-cyan-300"
                    />
                    {showFieldError("preferredTime") ? <span className="text-sm text-red-300">{errors.preferredTime?.message}</span> : null}
                  </label>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                    <p className="font-black text-white">Quote summary</p>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm text-zinc-300">
                    <div className="flex justify-between gap-4">
                      <dt>{servicePackage.name}</dt>
                      <dd className="font-bold text-white">{currency(servicePackage.basePrice)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>{vehicle.label}</dt>
                      <dd className="font-bold text-white">+{currency(vehicle.adjustment)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Add-ons</dt>
                      <dd className="font-bold text-white">+{currency(addonTotal)}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-white/10 pt-3 text-base">
                      <dt className="font-black text-white">Estimated total</dt>
                      <dd className="text-2xl font-black text-cyan-300">{currency(total)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : null}
          </div>

          {status === "success" ? (
            <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-semibold text-emerald-200">
              Your quote request was sent. ST Chicagoland Mobile Detailing will follow up shortly.
            </div>
          ) : null}

          {status === "error" ? (
            <div className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-semibold text-red-200">
              <p>{submitError}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 font-black text-white"
                >
                  Message us on Messenger
                </a>
                <a
                  href={`mailto:${businessEmail}`}
                  className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-300/30 px-4 font-black text-red-100"
                >
                  Email instead
                </a>
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
              disabled={step === 0 || status === "submitting"}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 font-black text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 font-black text-white shadow-glass transition hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Continue
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 font-black text-white shadow-glass transition hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-wait disabled:opacity-75"
              >
                {status === "submitting" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Sparkles className="h-5 w-5" aria-hidden="true" />}
                Submit quote request
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
