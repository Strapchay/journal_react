import ComponentOverlay from "../../ComponentOverlay";
import { useTableFunctionOptionActions } from "../../hooks/useTableFunctionOptionActions";
import SvgMarkup from "../../SvgMarkup";
import { TABLE_ACTION_OPTIONS, TABLE_PROPERTIES } from "../../utils/constants";
import styles from "../Journal.module.css";

function TableFunctionOptionComponent({
  componentName,
  form,
  setSelectedComponentState = null,
  switchSortProp = null,
  onSubmit,
  onOpenSidePeek = null,
}) {
  const properties = !form
    ? TABLE_ACTION_OPTIONS.properties
    : TABLE_PROPERTIES.properties.filter(
        (property) => property.text.toLowerCase() !== "created",
      );
  const {
    onSelectProperty,
    searchText,
    setSearchText,
    placeholder,
    renderedProperties,
  } = useTableFunctionOptionActions({
    onSubmit,
    componentName,
    properties,
    setSelectedComponentState,
    switchSortProp,
  });

  function getBeforeRenderFunc(property) {
    return property.text ===
      TABLE_ACTION_OPTIONS.properties[
        TABLE_ACTION_OPTIONS.properties.length - 1
      ].text
      ? onOpenSidePeek
      : onSelectProperty.bind(this, property.text.toLowerCase());
  }

  function getPropertyListType(property) {
    return form
      ? `${property?.text?.toLowerCase()}Filter`
      : `${property?.text?.toLowerCase()}Properties`;
  }

  return (
    <div
      className={[
        styles[`${componentName}-add-action--options`],
        styles["property-add-action--options"],
        styles["component-options"],
      ].join(" ")}
    >
      <div className={styles["property-options"]}>
        <div className={styles["property-options-property--option"]}>
          <div className={styles["property-content-box"]}>
            {form && (
              <form action="" id="property-content-forms">
                <input
                  type="text"
                  name={`${componentName}-search property-search`}
                  className={[
                    styles[`${componentName}-search`],
                    styles["property-search"],
                    styles["component-form"],
                  ].join(" ")}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={`${placeholder} by...`}
                />
              </form>
            )}
            <div className={styles["property-content"]}>
              <div
                className={[
                  styles[`${componentName}-content-search`],
                  styles["property-content-search"],
                ].join(" ")}
              >
                {renderedProperties?.map((property) => (
                  <ComponentOverlay.Open
                    key={property?.text}
                    opens={getPropertyListType(property)}
                    beforeRender={getBeforeRenderFunc(property)}
                  >
                    <PropertyItem
                      componentName={componentName}
                      property={property}
                    />
                  </ComponentOverlay.Open>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyItem({ componentName, property, onClick }) {
  return (
    <div
      className={[
        styles[`${componentName}-property-content`],
        styles["action-property-content"],
      ].join(" ")}
      onClick={onClick}
    >
      <div className={styles["action-property-icon"]}>
        <SvgMarkup
          classList={styles["property-icon"]}
          fragId={property.icon}
          styles={styles}
        />
      </div>
      <div className={styles["action-property-text"]}>{property.text}</div>
    </div>
  );
}

export default TableFunctionOptionComponent;
