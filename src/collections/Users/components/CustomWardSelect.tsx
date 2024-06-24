import React, { useEffect, useState } from 'react';
import { useField } from 'payload/components/forms';
import Select, { components } from 'react-select';
import { province } from '../../../json/all_VN_province';

interface CustomWardSelectProps {
    path: string;
    name: string;
    label: string;
    required: boolean;
}

const CustomWardSelect: React.FC<CustomWardSelectProps> = ({ name, path, label, required }) => {
    const { value: districtValue } = useField<string>({ path: 'district_id' });
    const { value, setValue } = useField<string>({ path });

    const [wardOptions, setWardOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        let selectedDistrict;

        province.forEach((prov: any) => {
            const district = prov.ListDistricts.find((dist: any) => dist.Code === districtValue);
            if (district) {
                selectedDistrict = district;
            }
        });

        if (selectedDistrict) {
            setWardOptions(
                selectedDistrict.ListWards.map((ward: { Name: string; Code: string }) => ({
                    label: ward.Name,
                    value: ward.Code,
                }))
            );
        } else {
            setWardOptions([]);
        }
    }, [districtValue]);

    useEffect(() => {
        const selectedDistrict = province
            .flatMap((prov: any) => prov.ListDistricts)
            .find((dist: any) => dist.Code === districtValue);

        if (selectedDistrict) {
            const selectedWard = selectedDistrict.ListWards.find((ward: { Code: string }) => ward.Code === value);
            if (!selectedWard) {
                setValue('');
            }
        }
    }, [wardOptions, value, setValue]);

    const handleChange = (selectedOption: { label: string; value: string } | null) => {
        setValue(selectedOption ? selectedOption.value : '');
    };

    return (
        <div className="field-type">
            <label className="field-label">
                {label}
                {required && <span style={{ color: 'red' }}> *</span>}
            </label>
            <Select
                name={name}
                required={required}
                value={wardOptions.find(option => option.value === value) || null}
                onChange={handleChange}
                options={wardOptions}
                placeholder="Select a value"
                classNamePrefix="rs"
                className="react-select css-b62m3t-container"
                components={{
                    Control: (props) => (
                        <components.Control {...props} className="rs__control css-13cymwt-control" />
                    ),
                    ValueContainer: (props) => (
                        <components.ValueContainer {...props} className="value-container rs__value-container css-1fdsijx-ValueContainer" />
                    ),
                    Placeholder: (props) => (
                        <components.Placeholder {...props} className="rs__placeholder css-1jqq78o-placeholder" />
                    ),
                    Input: (props) => (
                        <components.Input {...props} className="rs__input-container css-qbdosj-Input" />
                    ),
                    IndicatorsContainer: (props) => (
                        <components.IndicatorsContainer {...props} className="rs__indicators css-1hb7zxy-IndicatorsContainer" />
                    ),
                    IndicatorSeparator: () => (
                        <span className="rs__indicator-separator css-1u9des2-indicatorSeparator" />
                    ),
                    DropdownIndicator: (props) => (
                        <components.DropdownIndicator {...props}>
                            <svg className="icon icon--chevron" viewBox="0 0 9 7" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                <path className="stroke" d="M1.42871 1.5332L4.42707 4.96177L7.42543 1.5332" />
                            </svg>
                        </components.DropdownIndicator>
                    ),
                }}
            />
        </div>
    );
};

export default CustomWardSelect;
