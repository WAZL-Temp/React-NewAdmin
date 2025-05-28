import { useEffect, useState } from "react";
import { MultiSelect, MultiSelectChangeEvent, RadioButton, RadioButtonChangeEvent } from "../../../sharedBase/globalImports";
import { selectMultiData, selectRadioEnum } from "../../../sharedBase/dropdownUtils";
import { useAppUserService } from "../../../core/service/appUsers.service";
import { useListQuery } from "../../../store/useListQuery";
import { AppUser } from "../../../core/model/appuser";
import { ProductLive } from "../../../core/model/productlive";
import { getData } from "../../../sharedBase/lookupService";
import { useProductService } from "../../../core/service/products.service";

export default function FormControls() {
    const [model, setModel] = useState<{
        pizza?: string;
        pizzaLabel?: string;
        selectedUsers?: string;
        selectedUsersLabel?: string;
        selectedProductLive?: string;
        selectedProductLiveLabel?: string;
    }>({});
    const userService = useAppUserService();
    const query = useListQuery<AppUser>(userService);
    const productService = useProductService();
    const productQuery = useListQuery<ProductLive>(productService);
    const [listProductLive, setListProductLive] = useState<ProductLive[]>([]);
    // const [selectedProductLive, setSelectedProductLive] = useState<ProductLive[]>([]);
    const [listAppUser, setListAppUser] = useState<AppUser[]>([]);
    // const [selectedAppUser, setSelectedAppUser] = useState<AppUser[]>([]);
    const item = productQuery.data?.[0];
    const appuserItem = query.data?.[0];
    const [savedData, setSavedData] = useState<{
        pizza?: string;
        pizzaLabel?: string;
        selectedUsers?: string;
        selectedUsersLabel?: string;
        selectedProductLive?: string;
        selectedProductLiveLabel?: string;
    } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const list = await getData(productService, false);
                setListProductLive(list);
                if (item && item.productList) {
                    // const arrList = item.productList.split(',');
                    // const selectedList = list.filter((a) => arrList.includes(String(a.id)));
                    // setSelectedProductLive(selectedList);
                } else {
                    // setSelectedProductLive([]);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setListProductLive([]);
                // setSelectedProductLive([]);
            }
        };

        fetchData();
    }, [item]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userList = await getData(userService, false);
                setListAppUser(userList);
                if (appuserItem && appuserItem.appUserList) {
                    // const arrList = appuserItem.appUserList.split(',');
                    // const selectedList = userList.filter((a) => arrList.includes(String(a.id)));
                    // setSelectedAppUser(selectedList);
                } else {
                    // setSelectedAppUser([]);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setListAppUser([]);
                // setSelectedAppUser([]);
            }
        };

        fetchData();
    }, [appuserItem]);


    const handleRadioChange = (e: RadioButtonChangeEvent) => {
        selectRadioEnum(e, 'pizza', model, setModel, false);
    };

    const handleUserMultiSelectChange = (e: MultiSelectChangeEvent) => {
        const selectedUserIds = e.value;

        const selectedData = listAppUser.filter((u) => selectedUserIds.includes(u.id));
        const updatedModel = selectMultiData(selectedData, 'selectedUsers');
        setModel((prev) => ({ ...prev, ...updatedModel }));
    };

    const handleProductMultiSelectChange = (e: MultiSelectChangeEvent) => {
        const selectedUserIds = e.value;

        const selectedData = listProductLive.filter((u) => selectedUserIds.includes(u.id));
        const updatedModel = selectMultiData(selectedData, 'selectedProductLive');
        setModel((prev) => ({ ...prev, ...updatedModel }));
    };

    const handleSubmit = () => {
        setSavedData({ ...model });
        setModel({
            pizza: "",
            pizzaLabel: "",
            selectedUsers: "",
            selectedUsersLabel: "",
            selectedProductLive: "",
            selectedProductLiveLabel: "",
        });
    };

    const handleShow = () => {
        if (savedData) {
            setModel({ ...savedData });
        }
    };


    return (
        <div className="p-4">
            <div>
                <h1>Radio Button</h1>
                <div className="card flex justify-center">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center">
                            <RadioButton
                                inputId="ingredient1"
                                name="pizza"
                                value="Cheese"
                                onChange={handleRadioChange}
                                checked={model.pizza === 'Cheese'}
                            />
                            <label htmlFor="ingredient1" className="ml-2 text-gray-700">Cheese</label>
                        </div>
                        <div className="flex items-center">
                            <RadioButton
                                inputId="ingredient2"
                                name="pizza"
                                value="Mushroom"
                                onChange={handleRadioChange}
                                checked={model.pizza === 'Mushroom'}
                            />
                            <label htmlFor="ingredient2" className="ml-2 text-gray-700">Mushroom</label>
                        </div>
                        <div className="flex items-center">
                            <RadioButton
                                inputId="ingredient3"
                                name="pizza"
                                value="Pepper"
                                onChange={handleRadioChange}
                                checked={model.pizza === 'Pepper'}
                            />
                            <label htmlFor="ingredient3" className="ml-2 text-gray-700">Pepper</label>
                        </div>
                        <div className="flex items-center">
                            <RadioButton
                                inputId="ingredient4"
                                name="pizza"
                                value="Onion"
                                onChange={handleRadioChange}
                                checked={model.pizza === 'Onion'}
                            />
                            <label htmlFor="ingredient4" className="ml-2 text-gray-700">Onion</label>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-gray-800">
                    Selected Ingredient: {model.pizza || 'None'}
                    {model.pizzaLabel && <span>, Label: {model.pizzaLabel}</span>}
                </div>
            </div>

            <div className="my-4">
                <h1>MultiSelect - AppUser Names</h1>

                <MultiSelect
                    name="selectedUsers"
                    value={
                        model.selectedUsers
                            ? model.selectedUsers
                                .split(',')
                                .map((id) => parseInt(id))
                                .filter((id) => !isNaN(id))
                            : []
                    }
                    options={listAppUser}
                    onChange={handleUserMultiSelectChange}
                    optionLabel="name"
                    optionValue="id"
                    filter
                    placeholder="Select Names"
                    className="w-full border bg-[var(--color-white)] text-[var(--color-dark)] border-[var(--color-gray)] rounded-md shadow-sm"
                />

                <div className="mt-2 text-gray-800">
                    Selected Users: {model.selectedUsersLabel || 'None'}
                </div>
            </div>

            <div>
                <MultiSelect
                    name="selectedProductLive"
                    id="selectedProductLive"
                    value={
                        model.selectedProductLive
                            ? model.selectedProductLive
                                .split(',')
                                .map((id) => parseInt(id))
                                .filter((id) => !isNaN(id))
                            : []
                    }
                    options={listProductLive}
                    onChange={handleProductMultiSelectChange}
                    optionLabel="name"
                    optionValue="id"
                    filter
                    placeholder="Select Product Names"
                    className="w-full border bg-[var(--color-white)] text-[var(--color-dark)] border-[var(--color-gray)] rounded-md shadow-sm"
                />
                <div className="mt-2 text-gray-800">
                    Selected Products: {model.selectedProductLiveLabel || 'None'}
                </div>
            </div>

            <div className="mt-6 flex gap-4">
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Submit
                </button>
                <button
                    onClick={handleShow}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    Show Saved Values
                </button>
            </div>
        </div>
    )
}
