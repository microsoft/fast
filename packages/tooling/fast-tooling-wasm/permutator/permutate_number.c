#include <stdlib.h>
#include "cjson/cJSON.h"
#include "type.h"

double get_random_number(cJSON *configSchema)
{
    cJSON *multipleOf = cJSON_GetObjectItemCaseSensitive(configSchema, "multipleOf");
    cJSON *minimum = cJSON_GetObjectItemCaseSensitive(configSchema, "minimum");
    cJSON *exclusiveMinimum = cJSON_GetObjectItemCaseSensitive(configSchema, "exclusiveMinimum");
    cJSON *maximum = cJSON_GetObjectItemCaseSensitive(configSchema, "maximum");
    cJSON *exclusiveMaximum = cJSON_GetObjectItemCaseSensitive(configSchema, "exclusiveMaximum");

    const int multipleOfValue = multipleOf->valueint
        ? multipleOf->valueint
        : 1;
    const int minimumValue = minimum->valueint
        ? minimum->valueint
        : exclusiveMinimum->valueint
        ? exclusiveMinimum->valueint + 1
        : 0;
    const int maximumValue = maximum->valueint
        ? maximum->valueint + 1
        : exclusiveMaximum->valueint
        ? exclusiveMaximum->valueint
        : 101;
    const int randomNumber = (rand() % (maximumValue - minimumValue)) + minimumValue;
    const int remainder = randomNumber % multipleOfValue;

    return randomNumber - remainder;
}

double get_number_iteration_value(
    int iteration,
    enum Type type,
    cJSON *configSchema
)
{
    int count = 0;
    cJSON *defaultValue = cJSON_GetObjectItemCaseSensitive(configSchema, "default");
    cJSON *enumValues = cJSON_GetObjectItemCaseSensitive(configSchema, "enum");
    cJSON *exampleValues = cJSON_GetObjectItemCaseSensitive(configSchema, "examples");

    if (enumValues != NULL)
    {
        const int arraySize = cJSON_GetArraySize(enumValues);

        return cJSON_GetArrayItem(enumValues, iteration % arraySize)->valuedouble;
    } else {
        if (defaultValue != NULL)
        {
            if (count == iteration)
            {
                return defaultValue->valuedouble;
            }

            count++;
        }

        if (exampleValues != NULL)
        {
            const int arraySize = cJSON_GetArraySize(exampleValues);

            if (arraySize + count > iteration)
            {
                return cJSON_GetArrayItem(exampleValues, iteration - count)->valuedouble;
            }
        }

        return get_random_number(configSchema);
    }
}

struct PermutatedType permutate_number(
    int iteration,
    cJSON *configSchema
)
{
    struct PermutatedType permutation = {0};

    permutation.type = type;
    permutation.t.number = get_number_iteration_value(
        iteration,
        Number,
        configSchema
    );

    return permutation;
}
