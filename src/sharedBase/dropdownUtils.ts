import { DropdownChangeEvent } from "./globalImports";

export const selectDropdownEnum = (
  e: DropdownChangeEvent,
  controlName: string,
  setName = false,
  model: any
) => {
  const updatedModel = { ...model };

  updatedModel[controlName] = e.value;
  updatedModel[`${controlName}Label`] = e.target.name;

  if (setName) {
    updatedModel[controlName] = e.target.name;
  }

  return updatedModel;
};

interface Option {
  id: string | number;
  name: string;
}

interface Model {
  [key: string]: string | number;
}

export const selectMultiData = (
  data: { value: Option[] },
  controlName: string,
  model: Model,
  setModel: (model: Model) => void,
  item?: Record<string, unknown>
) => {
  const newModel = { ...model };
  newModel[controlName] = data.value.map((i) => i.id).join(',');
  if (item && controlName + 'Label' in item) {
    newModel[controlName + 'Label'] = data.value.map((i) => i.name).join(',');
  }
  setModel(newModel);
};

export const selectRadioEnum = (
  data: { value: string | number | { name: string }; name?: string },
  controlName: string,
  setName: boolean = false,
  model: Model,
  setModel: (model: Model) => void,
  item?: Record<string, unknown>
) => {
  const newModel = { ...model };
  newModel[controlName] = setName && typeof data.value === 'object' && data.value !== null
    ? (data.value as { name: string }).name
    : data.value as string | number;
  if (item && controlName + 'Label' in item) {
    newModel[controlName + 'Label'] = data.name || '';
  }
  setModel(newModel);
};