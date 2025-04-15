

export const selectDropdownEnum = (
    data: any,
    controlName: string,
    setName = false,
    model: any
  ) => {
    const updatedModel = { ...model };
  
    updatedModel[controlName] = data.value;
    updatedModel[`${controlName}Label`] = data.name;
  
    if (setName) {
      updatedModel[controlName] = data.name;
    }
  
    return updatedModel;
  };
  