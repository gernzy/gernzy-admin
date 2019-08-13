// Sets definitions so our graphql is not invalid

export default `

  directive @paginate(
      type: String,
      model: String,
      scopes: String,
      builder: String
  ) on FIELD_DEFINITION

  directive @can(
      ability: String
      model: String
      policy: String
  ) on FIELD_DEFINITION

  directive @find(
      model: String
  ) on FIELD_DEFINITION

  directive @field(
      resolver: String
  ) on FIELD_DEFINITION

  directive @gate(
      ability: String
      sessionOnly: Boolean
  ) on FIELD_DEFINITION

  directive @hasOne on FIELD_DEFINITION
  directive @belongsTo on FIELD_DEFINITION

  directive @spread on ARGUMENT_DEFINITION
  directive @eq on ARGUMENT_DEFINITION

  directive @rules(
      apply: String
  ) on INPUT_FIELD_DEFINITION

`;
