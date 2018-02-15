package ai.bilge.spark.webshell.service.mapper;

import ai.bilge.spark.webshell.domain.*;
import ai.bilge.spark.webshell.service.dto.ShellDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Shell and its DTO ShellDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ShellMapper extends EntityMapper<ShellDTO, Shell> {



    default Shell fromId(Long id) {
        if (id == null) {
            return null;
        }
        Shell shell = new Shell();
        shell.setId(id);
        return shell;
    }
}
