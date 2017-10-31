import {IStyleAPI, IStyleItem, IMatcherFunction, IComparatorFunction} from "import-sort-style";

const fixedOrder = ["react", "prop-types"];

const isReactModule: IMatcherFunction = (module) => Boolean(module.moduleName.match(/^(react|prop-types|redux)/));

export default function(styleApi: IStyleAPI): Array<IStyleItem> {
    const {
        alias,
        and,
        dotSegmentCount,
        hasNoMember,
        isAbsoluteModule,
        isNodeModule,
        isRelativeModule,
        moduleName,
        naturally,
        unicode,
    } = styleApi;

    const reactComparator: IComparatorFunction = (name1, name2) => {
        let i1 = fixedOrder.indexOf(name1);
        let i2 = fixedOrder.indexOf(name2);

        i1 = i1 === -1 ? Number.MAX_SAFE_INTEGER : i1;
        i2 = i2 === -1 ? Number.MAX_SAFE_INTEGER : i2;

        return i1 === i2 ? naturally(name1, name2) : i1 - i2;
    };

    return [
        // import "foo"
        {match: and(hasNoMember, isAbsoluteModule)},
        {separator: true},

        // import "./foo"
        {match: and(hasNoMember, isRelativeModule)},
        {separator: true},

        // import React from "react";
        {match: isReactModule, sort: moduleName(reactComparator), sortNamedMembers: alias(unicode)},
        {separator: true},

        // import … from "fs";
        {match: isNodeModule, sort: moduleName(naturally), sortNamedMembers: alias(unicode)},
        {separator: true},

        // import … from "foo";
        {match: isAbsoluteModule, sort: moduleName(naturally), sortNamedMembers: alias(unicode)},
        {separator: true},

        // import … from "./foo";
        // import … from "../foo";
        {match: isRelativeModule, sort: [dotSegmentCount, moduleName(naturally)], sortNamedMembers: alias(unicode)},
        {separator: true},
    ];
}
