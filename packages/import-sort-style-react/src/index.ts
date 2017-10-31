import {IStyleAPI, IStyleItem, IMatcherFunction} from "import-sort-style";

const isReactModule: IMatcherFunction = (module) => Boolean(module.moduleName.match(/^(react|prop-types|redux)/));

export default function (styleApi: IStyleAPI): Array<IStyleItem> {
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

    return [
        // import "foo"
        {match: and(hasNoMember, isAbsoluteModule)},
        {separator: true},

        // import "./foo"
        {match: and(hasNoMember, isRelativeModule)},
        {separator: true},

        // import React from "react";
        {match: isReactModule, sort: moduleName(naturally), sortNamedMembers: alias(unicode)},
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
