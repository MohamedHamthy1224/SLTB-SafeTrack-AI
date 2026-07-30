import React from 'react';
import UserStepOne from './UserStepOne';
import PoliceAdminStep from './PoliceAdminStep';
import SLTBAdminStep from './SLTBAdminStep';
import TrafficPoliceStep from './TrafficPoliceStep';

const UserWizard = ({
  step,
  formData,
  errors,
  onChange,
  onImageChange,
  onImageRemove,
  onNext,
  onBack,
  onSave,
}) => {
  if (step === 1) {
    return (
      <UserStepOne
        formData={formData}
        errors={errors}
        onChange={onChange}
        onImageChange={onImageChange}
        onImageRemove={onImageRemove}
        onNext={onNext}
      />
    );
  }

  if (step === 2) {
    if (formData.role === 'SLTB Admin') {
      return (
        <SLTBAdminStep
          formData={formData}
          errors={errors}
          onChange={onChange}
          onBack={onBack}
          onSave={onSave}
        />
      );
    }

    if (formData.role === 'Traffic Police Officer') {
      return (
        <TrafficPoliceStep
          formData={formData}
          errors={errors}
          onChange={onChange}
          onBack={onBack}
          onSave={onSave}
        />
      );
    }

    // Default to Police Admin Step
    return (
      <PoliceAdminStep
        formData={formData}
        errors={errors}
        onChange={onChange}
        onBack={onBack}
        onSave={onSave}
      />
    );
  }

  return null;
};

export default UserWizard;
