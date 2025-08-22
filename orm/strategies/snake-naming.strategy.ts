import { plural } from 'pluralize';
import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

/**
 * Custom implementation of NamingStrategyInterface using snake case
 */
export class SnakeCaseNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  /**
   * Normalizes table name
   *
   * @param {string} targetName - name taken from entity class name
   * @param {string} userSpecifiedName - user specified name
   * @returns {string} - string representing table name in plural
   */
  public tableName(
    targetName: string,
    userSpecifiedName: string | undefined,
  ): string {
    return userSpecifiedName
      ? userSpecifiedName
      : plural(snakeCase(targetName));
  }

  /**
   * Gets the table's column name from the given property name
   *
   * @param {string} propertyName - entity class property name
   * @param {string} customName - provided custom name
   * @param {Array<string>} embeddedPrefixes - embedded prefix
   * @returns {string} - string representing column name in snake_case
   */
  public columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return (
      snakeCase(embeddedPrefixes.concat('').join('_')) +
      (customName ? customName : snakeCase(propertyName))
    );
  }

  /**
   * Gets the table's relation name from the given property name
   *
   * @param {string} propertyName - given property name
   * @returns {string} - string representing property name
   */
  public relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  /**
   * Gets the name of the join column used in the one-to-one and many-to-one relations
   *
   * @param {string} relationName - given relation name
   * @param {string} referencedColumnName - given reference column name
   * @returns {string} - string representing joined colum name
   */
  public joinColumnName(
    relationName: string,
    referencedColumnName: string,
  ): string {
    return snakeCase(relationName + '_' + referencedColumnName);
  }

  /**
   * Gets the name of the column used for columns in the junction tables.
   *
   * @param {string} tableName - given table name
   * @param {string} propertyName - given property name
   * @param {string} columnName - given column name
   * @returns {string} - string representing joined table column name
   */
  public joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(`${tableName}_${columnName ? columnName : propertyName}`);
  }

  /**
   * Gets the name of the alias used for relation joins.
   *
   * @param {string} alias - given alias
   * @param {string} propertyPath - given property path
   * @returns {string} - string representing eager joined relation alias
   */
  public eagerJoinRelationAlias(alias: string, propertyPath: string): string {
    return alias + '__' + propertyPath.replace('.', '_');
  }

  /**
   * Gets the table's primary key name from the given table name and column names
   *
   * @param {Table | string} tableOrName - given table or name to PK
   * @param {Array<string>} columnNames - given list of colum names
   * @returns {string} - string representing primary key in snake_case
   */
  public primaryKeyName(
    tableOrName: Table | string,
    columnNames: string[],
  ): string {
    const clonedColumnNames = [...columnNames];

    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');

    return snakeCase(
      `${replacedTableName}_${clonedColumnNames.join('_')}_pkey`,
    );
  }

  /**
   * Gets the name of the index - simple and compose index
   *
   * @param {Table | string} tableOrName - given table or name to index
   * @param {Array<string>} columnNames - given list of colum names
   * @param {string} where - optional param
   * @returns {string} - string representing index in snake_case
   */
  public indexName(
    tableOrName: string | Table,
    columnNames: string[],
    where?: string,
  ): string {
    const clonedColumnNames = [...columnNames];

    clonedColumnNames.sort();
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    let key = clonedColumnNames.length
      ? `${replacedTableName}_${clonedColumnNames.join('_')}`
      : replacedTableName;

    if (where) {
      key += `_${where}`;
    }
    return snakeCase(`index_${key}`);
  }
}
