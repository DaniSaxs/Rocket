import { deepMap } from '../../utils/collection.js';
import { factory } from '../../utils/factory.js';
var name = 'isNumeric';
var dependencies = ['typed'];
export var createIsNumeric = /* #__PURE__ */factory(name, dependencies, (_ref) => {
  var {
    typed
  } = _ref;

  /**
   * Test whether a value is an numeric value.
   *
   * The function is evaluated element-wise in case of Array or Matrix input.
   *
   * Syntax:
   *
   *     math.isNumeric(x)
   *
   * Examples:
   *
   *    math.isNumeric(2)                     // returns true
   *    math.isNumeric('2')                   // returns false
   *    math.hasNumericValue('2')             // returns true
   *    math.isNumeric(0)                     // returns true
   *    math.isNumeric(math.bignumber(500))   // returns true
   *    math.isNumeric(math.fraction(4))      // returns true
   *    math.isNumeric(math.complex('2-4i')   // returns false
   *    math.isNumeric([2.3, 'foo', false])   // returns [true, false, true]
   *
   * See also:
   *
   *    isZero, isPositive, isNegative, isInteger, hasNumericValue
   *
   * @param {*} x       Value to be tested
   * @return {boolean}  Returns true when `x` is a `number`, `BigNumber`,
   *                    `Fraction`, or `boolean`. Returns false for other types.
   *                    Throws an error in case of unknown types.
   */
  return typed(name, {
    'number | BigNumber | Fraction | boolean': function numberBigNumberFractionBoolean() {
      return true;
    },
    'Complex | Unit | string | null | undefined | Node': function ComplexUnitStringNullUndefinedNode() {
      return false;
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return deepMap(x, this);
    }
  });
});