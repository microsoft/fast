#include <stdlib.h>
#include <stdbool.h>
#include <math.h>
#include "cjson/cJSON.h"
#include "type.h"

/**
 * Gets a random number that fits within the JSON schema
 * constraints
 */
double get_random_number(cJSON *configSchema)
{
    cJSON *multipleOf = cJSON_GetObjectItemCaseSensitive(configSchema, "multipleOf");
    cJSON *minimum = cJSON_GetObjectItemCaseSensitive(configSchema, "minimum");
    cJSON *exclusiveMinimum = cJSON_GetObjectItemCaseSensitive(configSchema, "exclusiveMinimum");
    cJSON *maximum = cJSON_GetObjectItemCaseSensitive(configSchema, "maximum");
    cJSON *exclusiveMaximum = cJSON_GetObjectItemCaseSensitive(configSchema, "exclusiveMaximum");

    const bool minimumDefined = (minimum && minimum->valuedouble) || (exclusiveMinimum && exclusiveMinimum->valuedouble);

    const bool maximumDefined = (maximum && maximum->valuedouble) || (exclusiveMaximum && exclusiveMaximum->valuedouble);

    const double multipleOfValue = multipleOf && multipleOf->valuedouble
        ? multipleOf->valuedouble
        : 1;
    double minimumValue = minimum && minimum->valuedouble
        ? minimum->valuedouble
        : exclusiveMinimum && exclusiveMinimum->valuedouble
        ? exclusiveMinimum->valuedouble + 1
        : 0;
    double maximumValue = maximum && maximum->valuedouble
        ? maximum->valuedouble + 1
        : exclusiveMaximum && exclusiveMaximum->valuedouble
        ? exclusiveMaximum->valuedouble
        : 101;

    if (maximumDefined && !minimumDefined)
    {
        minimumValue = maximumValue - 100;
    }

    if (!maximumDefined && minimumDefined)
    {
        maximumValue = minimumValue + 100; 
    }

    if (minimumValue > maximumValue)
    {
        return 0;
    }

    const double randomNumber = fmod(rand(), (maximumValue - minimumValue)) + minimumValue;
    const double remainder = fmod(randomNumber, multipleOfValue);

    return randomNumber - remainder;
}

/**
 * Gets a number using an iteration with the following caveats:
 * - if enums exist only use those
 * - if default and/or examples exist, use these before generating any random numbers
 */
double get_number_iteration_value(
    double iteration,
    enum Type type,
    cJSON *configSchema
)
{
    double count = 0;
    cJSON *defaultValue = cJSON_GetObjectItemCaseSensitive(configSchema, "default");
    cJSON *enumValues = cJSON_GetObjectItemCaseSensitive(configSchema, "enum");
    cJSON *exampleValues = cJSON_GetObjectItemCaseSensitive(configSchema, "examples");

    if (enumValues != NULL)
    {
        const double arraySize = cJSON_GetArraySize(enumValues);

        return cJSON_GetArrayItem(enumValues, fmod(iteration, arraySize))->valuedouble;
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
            const double arraySize = cJSON_GetArraySize(exampleValues);

            if (arraySize + count > iteration)
            {
                return cJSON_GetArrayItem(exampleValues, iteration - count)->valuedouble;
            }
        }

        return get_random_number(configSchema);
    }
}

/**
 * Create a permutation of a number
 */
struct PermutatedType permutate_number(
    int iteration,
    cJSON *configSchema
)
{
    struct PermutatedType permutation = {0};

    permutation.type = type;
    permutation.t.number = get_number_iteration_value(
        (double) iteration,
        Number,
        configSchema
    );

    return permutation;
}
