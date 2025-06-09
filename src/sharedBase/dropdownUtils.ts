import { DropdownChangeEvent, RadioButtonChangeEvent } from "./globalImports";

export const selectDropdownEnum = (
  e: DropdownChangeEvent,
  controlName: string,
  setName = false,
  model: any
) => {
  const updatedModel = { ...model };


  console.log("e.target.name:", e.target.name);
  console.log("controlName:", controlName);
  updatedModel[controlName] = e.value;
  updatedModel[`${controlName}Label`] = e.target.name;

  if (setName) {
    updatedModel[controlName] = e.target.name;
  }

  return updatedModel;
};

export const selectRadioEnum = (
  e: RadioButtonChangeEvent,
  controlName: string,
  model: any,
  setModel: (updatedModel: any) => void,
  isBoolean: boolean = false
) => {
  const updatedModel = { ...model };

  let value: any = e.value;
  if (isBoolean) {
    value = e.value === "true";
  }

  updatedModel[controlName] = value;

  if (controlName + 'Label' in updatedModel) {
    updatedModel[controlName + 'Label'] = e.target.name;
  }

  setModel(updatedModel);
};


interface Option {
  id: string | number;
  name: string;
}

interface Model {
  [key: string]: string | number;
}

export const selectMultiData = (
  data: any,
  controlName: string
) => {
  if (!data || !Array.isArray(data)) {
    return {
      [controlName]: '',
      [`${controlName}Label`]: '',
    };
  }

  const selectedIds = data.map((i: Option) => i.id).join(',');
  const selectedNames = data.map((i: Option) => i.name).join(',');

  const updatedModel: Model = {};
  updatedModel[controlName] = selectedIds;
  updatedModel[`${controlName}Label`] = selectedNames;

  return updatedModel;
};
