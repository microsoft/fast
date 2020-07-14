#include <stdbool.h>
#include "cjson/cJSON.h"
#include "parse.h"
#include "type.h"
#include "permutate_number.h"

/**
 * This function permutates over the root type
 */
void permutator(
    char* permutatorConfig,
    void (*permutate_callback)(char* permutation)
)
{
    cJSON *config = cJSON_Parse(permutatorConfig);
    const cJSON *configSchema = cJSON_GetObjectItemCaseSensitive(config, "schema");
    const cJSON *configSetSize = cJSON_GetObjectItemCaseSensitive(config, "setSize");
    const cJSON *schemaType = cJSON_GetObjectItemCaseSensitive(configSchema, "type");
    
    enum Type type = parse_type(schemaType->valuestring);
    int setSize = configSetSize->valueint;

    if (setSize > 0)
    {
        for (int i = 0; i < setSize; i++)
        {
            switch (type)
            {
                case Number:
                    permutate_callback(
                        cJSON_Print(
                            cJSON_CreateNumber(
                                permutate_number(i, configSchema).t.number
                            )
                        )
                    );
                    break;
                case String:
                    break;
                case Null:
                    break;
                case Boolean:
                    break;
                case Array:
                    break;
                case Object:
                    break;
            }
        }
    }
}
