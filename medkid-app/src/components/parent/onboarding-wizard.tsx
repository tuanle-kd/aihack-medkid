'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import {
  UserRound,
  Baby,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Phone,
  Lock,
  Calendar,
  Weight,
  Mail,
  Key,
  Shield,
  Loader2,
  XCircle,
  Pencil,
  Trash2,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Constants ─────────────────────────────────────────────────────────────────

// Demo OTP — never log this value to console or debug output
const DEMO_OTP_VALUE = '123456';
const MAX_CHILDREN = 5;

// ─── Types ─────────────────────────────────────────────────────────────────────

type Step = 1 | 'otp' | 2;

interface ParentForm {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

interface ChildEntry {
  id: string;
  name: string;
  dob: string;
  gender: 'male' | 'female' | '';
  weight_kg: string;
  vclinic_id: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const INIT_PARENT: ParentForm = { full_name: '', email: '', phone: '', password: '' };

function makeNewChild(): ChildEntry {
  return { id: `c-${Date.now()}`, name: '', dob: '', gender: '', weight_kg: '', vclinic_id: '' };
}

function validatePassword(pw: string): string {
  if (pw.length < 8) return 'Mật khẩu tối thiểu 8 ký tự.';
  if (!/[A-Z]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 chữ hoa (A–Z).';
  if (!/[0-9]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 chữ số (0–9).';
  return '';
}

// ─── Main component ────────────────────────────────────────────────────────────

export function OnboardingWizard() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [referenceTimeMs] = useState(() => Date.now());
  const [step, setStep] = useState<Step>(1);
  const [parent, setParent] = useState<ParentForm>(INIT_PARENT);

  // OTP state — no OTP value is ever logged
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  // Children state
  const [children, setChildren] = useState<ChildEntry[]>([]);
  const [currentChild, setCurrentChild] = useState<ChildEntry>(makeNewChild());
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [vclinicStatus, setVclinicStatus] = useState<'idle' | 'verifying' | 'success' | 'fail'>('idle');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── Field change handlers ──────────────────────────────────────────────────

  const setP =
    (k: keyof ParentForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setParent((p) => ({ ...p, [k]: e.target.value }));
      setErrors((err) => { const c = { ...err }; delete c[k]; return c; });
    };

  const setCC =
    (k: keyof ChildEntry) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setCurrentChild((c) => ({ ...c, [k]: e.target.value }));
      setErrors((err) => { const c = { ...err }; delete c[k]; return c; });
      if (k === 'vclinic_id') setVclinicStatus('idle');
    };

  // ─── Validation ────────────────────────────────────────────────────────────

  const validateStep1 = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!parent.full_name.trim()) errs.full_name = 'Vui lòng nhập họ tên.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parent.email))
      errs.email = 'Email không hợp lệ (VD: ten@email.com).';
    if (!/^0\d{9}$/.test(parent.phone))
      errs.phone = 'Số điện thoại không hợp lệ (VD: 0901234567).';
    const pwErr = validatePassword(parent.password);
    if (pwErr) errs.password = pwErr;
    return errs;
  };

  const validateCurrentChild = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!currentChild.name.trim()) errs.name = 'Vui lòng nhập tên bé.';
    if (!currentChild.dob) errs.dob = 'Vui lòng chọn ngày sinh.';
    if (!currentChild.gender) errs.gender = 'Vui lòng chọn giới tính.';
    return errs;
  };

  // ─── Step 1 handlers ───────────────────────────────────────────────────────

  const handleStep1 = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep('otp');
    setOtpSent(false);
    setOtpInput('');
    setOtpError('');
  };

  // ─── OTP handlers ──────────────────────────────────────────────────────────

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpError('');
    // Demo mode: no real SMS is sent
  };

  const handleVerifyOtp = () => {
    if (otpInput === DEMO_OTP_VALUE) {
      setOtpError('');
      setStep(2);
    } else {
      setOtpError('OTP không đúng. Vui lòng thử lại (Demo: 6 chữ số).');
    }
  };

  // ─── VCLINIC handlers ──────────────────────────────────────────────────────

  const handleVerifyVclinic = () => {
    if (!currentChild.vclinic_id.trim()) return;
    setVclinicStatus('verifying');
    setTimeout(() => {
      setVclinicStatus(
        /^VC-\d{4}-\d{4}$/.test(currentChild.vclinic_id.trim()) ? 'success' : 'fail'
      );
    }, 700);
  };

  // ─── Child management handlers ─────────────────────────────────────────────

  const handleSaveChild = () => {
    const errs = validateCurrentChild();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (editingIdx !== null) {
      setChildren((prev) => prev.map((c, i) => (i === editingIdx ? currentChild : c)));
      setEditingIdx(null);
    } else {
      setChildren((prev) => [...prev, currentChild]);
    }

    setCurrentChild(makeNewChild());
    setVclinicStatus('idle');
    setErrors({});
  };

  const handleEditChild = (idx: number) => {
    setCurrentChild(children[idx]);
    setEditingIdx(idx);
    setVclinicStatus(children[idx].vclinic_id ? 'success' : 'idle');
    setErrors({});
  };

  const handleRemoveChild = (idx: number) => {
    setChildren((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) {
      setEditingIdx(null);
      setCurrentChild(makeNewChild());
      setVclinicStatus('idle');
    }
  };

  // ─── Finish ────────────────────────────────────────────────────────────────

  const handleFinish = () => {
    if (editingIdx !== null) {
      // Currently editing an existing child — validate and save
      const errs = validateCurrentChild();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setChildren((prev) => prev.map((c, i) => (i === editingIdx ? currentChild : c)));
    } else if (children.length === 0) {
      // No saved children yet — validate and save current form
      const errs = validateCurrentChild();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setChildren((prev) => [...prev, currentChild]);
    }
    // If children.length > 0 and not editing, partial form is ignored and we proceed
    completeOnboarding();
  };

  // ─── Derived display values ────────────────────────────────────────────────

  const displayStep = step === 2 ? 2 : 1;
  const stepLabel =
    step === 2 ? 'Hồ sơ bệnh nhi' : step === 'otp' ? 'Xác thực OTP' : 'Tài khoản phụ huynh';
  const stepTitle =
    step === 2 ? 'Thêm hồ sơ bé' : step === 'otp' ? 'Xác minh số điện thoại' : 'Đăng ký tài khoản';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gradient-to-br from-teal-900/90 to-slate-900/90 p-4 backdrop-blur-sm">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-6 pt-6 pb-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
              {step === 2 ? <Baby className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-teal-200">
                Bước {displayStep}/2 — {stepLabel}
              </p>
              <h2 className="text-base font-black">{stepTitle}</h2>
            </div>
          </div>
          <div className="flex gap-1.5">
            {([1, 2] as const).map((s) => (
              <div
                key={s}
                className={cn(
                  'h-1 flex-1 rounded-full transition-all duration-300',
                  s <= displayStep ? 'bg-white' : 'bg-white/30'
                )}
              />
            ))}
          </div>
        </div>

        {/* ── Form body ── */}
        <div className="space-y-4 px-6 py-5">
          {step === 1 && (
            <>
              <Field
                id="parent-full-name"
                label="Họ và tên phụ huynh"
                icon={<UserRound className="h-4 w-4" />}
                type="text"
                placeholder="Nguyễn Văn Nam"
                value={parent.full_name}
                onChange={setP('full_name')}
                error={errors.full_name}
              />
              <Field
                id="parent-email"
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                type="email"
                placeholder="ten@email.com"
                value={parent.email}
                onChange={setP('email')}
                error={errors.email}
              />
              <Field
                id="parent-phone"
                label="Số điện thoại"
                icon={<Phone className="h-4 w-4" />}
                type="tel"
                placeholder="0901 234 567"
                value={parent.phone}
                onChange={setP('phone')}
                error={errors.phone}
              />
              <Field
                id="parent-password"
                label="Mật khẩu"
                icon={<Lock className="h-4 w-4" />}
                type="password"
                placeholder="≥8 ký tự, 1 chữ hoa, 1 chữ số"
                value={parent.password}
                onChange={setP('password')}
                error={errors.password}
              />
              <PasswordStrengthHint password={parent.password} />
              <p className="text-[10px] text-slate-400 leading-relaxed">
                [Demo] Tài khoản kiểm thử nội bộ. Dữ liệu không lưu trữ thật trong chế độ demo.
              </p>
            </>
          )}

          {step === 'otp' && (
            <OtpStep
              phone={parent.phone}
              otpSent={otpSent}
              otpInput={otpInput}
              otpError={otpError}
              onSend={handleSendOtp}
              onChangeInput={(v) => {
                setOtpInput(v);
                setOtpError('');
              }}
              onVerify={handleVerifyOtp}
            />
          )}

          {step === 2 && (
            <Step2Form
              childEntries={children}
              currentChild={currentChild}
              editingIdx={editingIdx}
              vclinicStatus={vclinicStatus}
              referenceTimeMs={referenceTimeMs}
              errors={errors}
              setCC={setCC}
              onVerifyVclinic={handleVerifyVclinic}
              onSaveChild={handleSaveChild}
              onEditChild={handleEditChild}
              onRemoveChild={handleRemoveChild}
            />
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex gap-2 px-6 pb-6">
          {(step === 'otp' || step === 2) && (
            <Button
              variant="outline"
              className="flex-1 text-sm font-bold"
              onClick={() => {
                if (step === 'otp') setStep(1);
                else setStep('otp');
              }}
            >
              Quay lại
            </Button>
          )}

          {step === 1 && (
            <Button
              className="flex-[2] bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm"
              onClick={handleStep1}
            >
              Tiếp theo
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          )}

          {step === 'otp' && (
            <Button
              className="flex-[2] bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm"
              onClick={handleVerifyOtp}
              disabled={!otpSent || otpInput.length === 0}
            >
              Xác nhận OTP
              <Shield className="h-4 w-4 ml-1.5" />
            </Button>
          )}

          {step === 2 && (
            <Button
              className="flex-[2] bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm"
              onClick={handleFinish}
            >
              <CheckCircle className="h-4 w-4 mr-1.5" />
              Hoàn tất đăng ký
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── OTP Step ──────────────────────────────────────────────────────────────────

function OtpStep({
  phone,
  otpSent,
  otpInput,
  otpError,
  onSend,
  onChangeInput,
  onVerify,
}: {
  phone: string;
  otpSent: boolean;
  otpInput: string;
  otpError: string;
  onSend: () => void;
  onChangeInput: (v: string) => void;
  onVerify: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-teal-100 bg-teal-50 p-3">
        <p className="text-xs font-medium text-teal-800 leading-relaxed">
          Chúng tôi sẽ gửi mã OTP đến số{' '}
          <strong className="font-bold">{phone}</strong>.
        </p>
        <p className="mt-1 text-[10px] text-teal-600">
          [Demo mode] Không gửi SMS thật. Nhập mã 6 chữ số để thử nghiệm.
        </p>
      </div>

      {!otpSent ? (
        <Button
          className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold"
          onClick={onSend}
        >
          Gửi OTP
          <Phone className="h-4 w-4 ml-1.5" />
        </Button>
      ) : (
        <div className="space-y-3">
          <div>
            <label
              htmlFor="otp-input"
              className="mb-1.5 block text-xs font-bold text-slate-700"
            >
              Nhập mã OTP
            </label>
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="_ _ _ _ _ _"
              value={otpInput}
              onChange={(e) => onChangeInput(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && onVerify()}
              autoFocus
              className={cn(
                'min-h-12 w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-center text-2xl font-bold tracking-[0.4em] transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-600',
                otpError ? 'border-red-300 bg-red-50' : 'border-slate-200'
              )}
              aria-invalid={Boolean(otpError)}
              aria-describedby={otpError ? 'otp-error' : undefined}
            />
            {otpError && (
              <p id="otp-error" role="alert" className="mt-1 text-[11px] font-semibold text-red-500">
                {otpError}
              </p>
            )}
          </div>
          <button
            type="button"
            className="text-[11px] font-medium text-teal-600 underline underline-offset-2 hover:text-teal-800"
            onClick={onSend}
          >
            Gửi lại OTP
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Step 2 Form ───────────────────────────────────────────────────────────────

function Step2Form({
  childEntries,
  currentChild,
  editingIdx,
  vclinicStatus,
  referenceTimeMs,
  errors,
  setCC,
  onVerifyVclinic,
  onSaveChild,
  onEditChild,
  onRemoveChild,
}: {
  childEntries: ChildEntry[];
  currentChild: ChildEntry;
  editingIdx: number | null;
  vclinicStatus: 'idle' | 'verifying' | 'success' | 'fail';
  referenceTimeMs: number;
  errors: Record<string, string>;
  setCC: (
    k: keyof ChildEntry
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onVerifyVclinic: () => void;
  onSaveChild: () => void;
  onEditChild: (idx: number) => void;
  onRemoveChild: (idx: number) => void;
}) {
  const showForm = editingIdx !== null || childEntries.length < MAX_CHILDREN;

  return (
    <div className="space-y-4">
      {/* Counter */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-700">
          {editingIdx !== null
            ? 'Chỉnh sửa hồ sơ bé'
            : childEntries.length === 0
            ? 'Thêm hồ sơ bé đầu tiên'
            : 'Thêm hồ sơ bé mới'}
        </p>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-bold',
            childEntries.length >= MAX_CHILDREN
              ? 'bg-amber-100 text-amber-700'
              : 'bg-teal-50 text-teal-700'
          )}
        >
          {childEntries.length}/{MAX_CHILDREN} hồ sơ
        </span>
      </div>

      {/* Max warning */}
      {childEntries.length >= MAX_CHILDREN && editingIdx === null && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          Đã đạt tối đa 5 hồ sơ bệnh nhi. Chỉnh sửa hoặc xóa hồ sơ hiện có để tiếp tục.
        </div>
      )}

      {/* Child entry form */}
      {showForm && (
        <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <Field
            id="child-name"
            label="Tên bé"
            icon={<Baby className="h-4 w-4" />}
            type="text"
            placeholder="Nguyễn Bảo Anh"
            value={currentChild.name}
            onChange={setCC('name')}
            error={errors.name}
          />

          <Field
            id="child-dob"
            label="Ngày sinh"
            icon={<Calendar className="h-4 w-4" />}
            type="date"
            placeholder=""
            value={currentChild.dob}
            onChange={setCC('dob')}
            error={errors.dob}
          />

          <div>
            <label
              htmlFor="child-gender"
              className="mb-1.5 block text-xs font-bold text-slate-700"
            >
              Giới tính
            </label>
            <select
              id="child-gender"
              value={currentChild.gender}
              onChange={setCC('gender')}
              className={cn(
                'min-h-11 w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-base font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-600 sm:text-sm',
                errors.gender ? 'border-red-300' : 'border-slate-200'
              )}
              aria-invalid={Boolean(errors.gender)}
              aria-describedby={errors.gender ? 'gender-error' : undefined}
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="male">Bé trai</option>
              <option value="female">Bé gái</option>
            </select>
            {errors.gender && (
              <p id="gender-error" role="alert" className="mt-1 text-[11px] font-semibold text-red-500">
                {errors.gender}
              </p>
            )}
          </div>

          <Field
            id="child-weight"
            label="Cân nặng (kg) — tuỳ chọn"
            icon={<Weight className="h-4 w-4" />}
            type="number"
            placeholder="12.5"
            value={currentChild.weight_kg}
            onChange={setCC('weight_kg')}
          />

          {/* VCLINIC ID */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              VCLINIC ID{' '}
              <span className="font-normal text-slate-400">(tuỳ chọn)</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Key className="h-4 w-4" />
                </span>
                <input
                  id="vclinic-id"
                  type="text"
                  placeholder="VC-2024-0815"
                  value={currentChild.vclinic_id}
                  onChange={setCC('vclinic_id')}
                  className={cn(
                    'min-h-11 w-full rounded-xl border bg-slate-50 py-2.5 pl-9 pr-3.5 text-base font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-600 sm:text-sm',
                    vclinicStatus === 'success'
                      ? 'border-emerald-300 bg-emerald-50'
                      : vclinicStatus === 'fail'
                      ? 'border-red-300 bg-red-50'
                      : 'border-slate-200'
                  )}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="shrink-0 text-xs font-bold px-3 min-h-11"
                onClick={onVerifyVclinic}
                disabled={vclinicStatus === 'verifying' || !currentChild.vclinic_id.trim()}
              >
                {vclinicStatus === 'verifying' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : vclinicStatus === 'success' ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : vclinicStatus === 'fail' ? (
                  <XCircle className="h-3.5 w-3.5 text-red-500" />
                ) : (
                  'Xác minh'
                )}
              </Button>
            </div>
            {vclinicStatus === 'success' && (
              <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                VCLINIC ID hợp lệ [Demo]
              </p>
            )}
            {vclinicStatus === 'fail' && (
              <p className="mt-1 text-[11px] font-semibold text-red-500">
                Không tìm thấy. Định dạng: VC-YYYY-NNNN [Demo]
              </p>
            )}
          </div>

          {/* Save child button — shown when there are already saved children or when editing */}
          {(childEntries.length > 0 || editingIdx !== null) && (
            <Button
              type="button"
              variant="outline"
              className="w-full text-sm font-bold border-teal-200 text-teal-700 hover:bg-teal-50"
              onClick={onSaveChild}
            >
              {editingIdx !== null ? (
                <>
                  <Pencil className="h-4 w-4 mr-1.5" />
                  Cập nhật hồ sơ
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Lưu &amp; thêm bé tiếp theo
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Saved children list */}
      {childEntries.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Đã thêm ({childEntries.length} bé)
          </p>
          {childEntries.map((child, idx) => (
            <ChildRow
              key={child.id}
              child={child}
              isEditing={editingIdx === idx}
              referenceTimeMs={referenceTimeMs}
              onEdit={() => onEditChild(idx)}
              onRemove={() => onRemoveChild(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Child Row ─────────────────────────────────────────────────────────────────

function ChildRow({
  child,
  isEditing,
  referenceTimeMs,
  onEdit,
  onRemove,
}: {
  child: ChildEntry;
  isEditing: boolean;
  referenceTimeMs: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const ageMonths = child.dob
    ? Math.floor((referenceTimeMs - new Date(child.dob).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors',
        isEditing ? 'border-teal-300 bg-teal-50' : 'border-slate-200 bg-white'
      )}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
        <Baby className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-800">{child.name}</p>
        <p className="text-[10px] text-slate-500">
          {ageMonths !== null ? `${ageMonths} tháng` : '—'}
          {child.gender === 'male' ? ' · Bé trai' : child.gender === 'female' ? ' · Bé gái' : ''}
          {child.vclinic_id ? ` · ${child.vclinic_id}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-teal-700"
          aria-label={`Sửa hồ sơ ${child.name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label={`Xóa hồ sơ ${child.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Password strength hint ────────────────────────────────────────────────────

function PasswordStrengthHint({ password }: { password: string }) {
  if (!password) return null;
  const hasMin = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);

  return (
    <div className="-mt-2 space-y-1">
      <StrengthRow ok={hasMin} text="Tối thiểu 8 ký tự" />
      <StrengthRow ok={hasUpper} text="Ít nhất 1 chữ hoa (A–Z)" />
      <StrengthRow ok={hasNum} text="Ít nhất 1 chữ số (0–9)" />
    </div>
  );
}

function StrengthRow({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-[11px] font-medium',
        ok ? 'text-emerald-600' : 'text-slate-400'
      )}
    >
      {ok ? (
        <CheckCircle2 className="h-3 w-3 shrink-0" />
      ) : (
        <div className="h-3 w-3 shrink-0 rounded-full border border-slate-300" />
      )}
      {text}
    </div>
  );
}

// ─── Field component ───────────────────────────────────────────────────────────

function Field({
  id,
  label,
  icon,
  type,
  placeholder,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            'min-h-11 w-full rounded-xl border bg-slate-50 py-2.5 pl-9 pr-3.5 text-base font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-600 sm:text-sm',
            error ? 'border-red-300 bg-red-50' : 'border-slate-200'
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-[11px] font-semibold text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
