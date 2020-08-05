#include "type.h"

enum Type type;

/**
 * When given a Type returns the corresponding string
 * used in JSON schema for data type
 */
char* get_type_as_string(enum Type type)
{
    switch (type)
    {
        case Number: return "number";
        case String: return "string";
        case Boolean: return "boolean";
        case Null: return "null";
        case Array: return "array";
        case Object: return "object";
    }

    return 0;
}
