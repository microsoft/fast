#include "type.h"

char* get_type_as_string(enum Type type)
{
    switch (type)
    {
        case Number: return "number";
        case String: return "string";
        case Boolean: return "boolean";
        case Null: return "null";
        case Object: return "object";
        case Array: return "array";
    }
}
