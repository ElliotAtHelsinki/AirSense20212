import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import trim from 'lodash/trim';

const { Search } = Input;

function SearchCommon({ suffixIcon, onSearch, defaultValue, ...props }) {
    const [valueSearch, setValueSearch] = useState(defaultValue);

    useEffect(() => {
        if (defaultValue !== valueSearch) setValueSearch(defaultValue);
    }, [defaultValue]);

    return (
        <Search
            onSearch={(value) => {
                onSearch(trim(value));
                setValueSearch(trim(value));
            }}
            onChange={(event) => {
                setValueSearch(event.target.value);
            }}
            value={valueSearch}
            onBlur={() => {
                defaultValue !== valueSearch && setValueSearch(defaultValue);
            }}
            onPressEnter={({ target: { value } }) => {
                onSearch(trim(value) || undefined);
                setValueSearch(trim(value));
            }}
            {...props}
            enterButton={false}
        />
    );
}

export default SearchCommon;
