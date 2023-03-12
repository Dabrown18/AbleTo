import React, { FunctionComponent } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import ActionListItem from './ActionListItem';
import { ItemType } from './types';

type Props = {
    items: ItemType[];
    action: Function;
    keyProp?: string; // keyExtractor will fallback to using index or 'key' prop on the item, if this is not passed in
    iconProp?: string;
    renderItem?: ListRenderItem<ItemType>; // renderItem will fallback to displaying ActionListItem, if this is not passed in
    HeaderComponent?: React.ComponentType<any> | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
};

const ActionList: FunctionComponent<Props> = ({ items, action, keyProp, iconProp, renderItem, HeaderComponent }) => {
    const render: ListRenderItem<ItemType> = ({ item }) => (
        <ActionListItem item={item} iconProp={iconProp} action={action} />
    );
    const keyExtractor = keyProp ? (item: ItemType) => item[keyProp] : undefined;

    return (
        <FlatList<ItemType>
            data={items}
            renderItem={renderItem || render}
            ListHeaderComponent={HeaderComponent}
            keyExtractor={keyExtractor}
        />
    );
};

export default ActionList;
