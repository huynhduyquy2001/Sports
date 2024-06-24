import React, { useEffect, useState } from 'react';
import { useField } from 'payload/components/forms';
import Select, { components } from 'react-select';
import { province } from '../../../json/all_VN_province';

interface CustomDistrictSelectProps {
    path: string;
    name: string;
    label: string;
    required: boolean;
}

const CustomDistrictSelect: React.FC<CustomDistrictSelectProps> = ({ name, path, label, required }) => {
    const { value: provinceValue } = useField<string>({ path: 'province_id' });
    const { value, setValue } = useField<string>({ path });

    const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        const selectedProvince = province.find((prov: any) => prov.Code === provinceValue);

        if (selectedProvince) {
            setDistrictOptions(
                selectedProvince.ListDistricts.map((district: { Name: string; Code: string }) => ({
                    label: district.Name,
                    value: district.Code,
                }))
            );
        } else {
            setDistrictOptions([]);
        }
    }, [provinceValue]);

    useEffect(() => {
        const selectedProvince = province.find((prov: any) => prov.Code === provinceValue);
        if (selectedProvince) {
            const selectedDistrict = selectedProvince.ListDistricts.find((district: { Code: string }) => district.Code === value);
            if (!selectedDistrict) {
                setValue('');
            }
        }
    }, [districtOptions, value, setValue]);

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
                value={districtOptions.find(option => option.value === value) || null}
                onChange={handleChange}
                options={districtOptions}
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

export default CustomDistrictSelect;
