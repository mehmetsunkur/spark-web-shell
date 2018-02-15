package ai.bilge.spark.webshell.service.mapper;

import ai.bilge.spark.webshell.domain.*;
import ai.bilge.spark.webshell.service.dto.TerminalDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Terminal and its DTO TerminalDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TerminalMapper extends EntityMapper<TerminalDTO, Terminal> {



    default Terminal fromId(Long id) {
        if (id == null) {
            return null;
        }
        Terminal terminal = new Terminal();
        terminal.setId(id);
        return terminal;
    }
}
