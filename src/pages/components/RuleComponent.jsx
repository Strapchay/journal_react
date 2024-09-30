import { useContext } from "react";
import styles from "../Journal.module.css";
import { AuthContext } from "../../ProtectedRoute";
import { useRef } from "react";
import ComponentOverlay from "../../ComponentOverlay";
import SvgMarkup from "../../SvgMarkup";
import { TABLE_PROPERTIES } from "../../utils/constants";
import { capitalize } from "../../utils/helpers";
import FilterComponent from "./FilterComponent";
import SortComponent from "./SortComponent";

const ComponentSelector = {
  filter: FilterComponent,
  sort: SortComponent,
};

function RuleComponent() {
  const { tableFuncPositionerRef, currentTableFunc } = useContext(AuthContext);
  const funcKeys = currentTableFunc ? Object.keys(currentTableFunc) : [];
  const rules = funcKeys
    .map((key) => currentTableFunc[key])
    .filter((func) => func.active);
  const multipleRulesExist = rules.length > 1;

  return (
    <div className={styles["property-container"]}>
      <div className={styles["property-actions"]} ref={tableFuncPositionerRef}>
        {rules.map((rule, i) => (
          <RuleItemComponent
            key={rule.component}
            rule={rule}
            multipleRulesExist={multipleRulesExist}
            index={i}
          />
        ))}
      </div>
      <div className={styles["div-filler"]}></div>
    </div>
  );
}

function RuleItemComponent({ rule, multipleRulesExist, index }) {
  const ruleItemRef = useRef(null);
  const RuleComponent = ComponentSelector[rule?.component];

  return (
    <div
      className={[
        styles[index === 0 && multipleRulesExist && "first-action-container"],
        styles[`${rule?.component?.toLowerCase()}-action-container`],
        styles["property-action-container"],
      ].join(" ")}
      key={rule?.component}
    >
      <ComponentOverlay>
        <ComponentOverlay.Open opens={`${rule?.property}FilterRule`}>
          <PropertyFilterRule rule={rule} ruleItemRef={ruleItemRef} />
        </ComponentOverlay.Open>
        <ComponentOverlay.Window
          name={`${rule?.property}FilterRule`}
          objectToOverlay={ruleItemRef}
        >
          <RuleComponent property={rule?.property} />
        </ComponentOverlay.Window>
      </ComponentOverlay>
    </div>
  );
}

function PropertyFilterRule({ rule, ruleItemRef, onClick }) {
  const { journalState } = useContext(AuthContext);

  const ruleIcon = TABLE_PROPERTIES.properties.find(
    (prop) => prop.text.toLowerCase() === rule.property.toLowerCase(),
  ).icon;

  function getRuleTextToRender(rule) {
    if (rule.component.toLowerCase() === "filter") {
      if (rule.tags.length > 0) {
        const tagValues = rule.tags.map(
          (tagId) => journalState.tags.find((tag) => tag.id === tagId).text,
        );
        return tagValues.length > 0 ? tagValues.join(", ") : rule.conditional;
      } else return rule.text.length > 0 ? rule.text : rule.conditional;
    } else return rule.type;
  }

  return (
    <div
      className={[
        styles[`${rule.component.toLowerCase()}-added-rule-box`],
        styles["property-added-rule-box"],
      ].join(" ")}
      ref={ruleItemRef}
      onClick={onClick}
    >
      <div className={styles["property-added-rule-property"]}>
        <div className={styles["property-rule-icon"]}>
          <SvgMarkup
            classList={styles["property-added-rule-icon"]}
            fragId={ruleIcon}
            styles={styles}
          />
        </div>
        <div
          className={[
            styles[`${rule.component.toLowerCase()}-added-rule-name`],
            styles["property-added-rule-name"],
          ].join(" ")}
        >
          {capitalize(rule.property)}:
        </div>
      </div>
      <div
        className={[
          styles[`${rule.component.toLowerCase()}-added-rule`],
          styles["added-rule"],
        ].join(" ")}
      >
        {getRuleTextToRender(rule)}
      </div>
      <div className={styles["added-rule-icon"]}>
        <SvgMarkup
          classList="rule-icon icon-sm"
          fragId="arrow-down"
          styles={styles}
        />
      </div>
    </div>
  );
}

export default RuleComponent;
