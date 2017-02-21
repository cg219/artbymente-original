const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

class CustomType {
  static DateType() {
    return new GraphQLScalarType({
      name: 'Date',
      description: 'native Javascript Date type',
      serialize(value) {
        return value.getTime()
      },
      parseValue(value) {
        return new Date(value);
      },
      parseLiteral(literal) {
        if (literal.kind === Kind.INT) {
          return parseInt(literal.value, 10);
        }

        return null;
      }
    })
  }
}

module.exports = CustomType;