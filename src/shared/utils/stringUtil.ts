/** Convert float to Integer in Cents. Ex: 10 -> 1000 | 10.00 -> 1000 | 10.0 -> 1000 */
export async function floatToIntegerCents(value: any): Promise<number> {
  value = value.toString();
  if (!value.includes('.'))
    //without dot/comma '100'
    return parseInt(value + '00');

  var brokeValue = value.split('.');

  if (brokeValue[1].length < 2)
    //just 1 after dot/comma '100.2'
    return parseInt(brokeValue[0] + brokeValue[1] + '0');

  if (brokeValue[1].length == 2)
    //2 after dot/comma '100.32'
    return parseInt(brokeValue[0] + brokeValue[1] + '');

  return value
}
