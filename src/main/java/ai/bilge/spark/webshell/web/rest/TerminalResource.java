package ai.bilge.spark.webshell.web.rest;

import com.codahale.metrics.annotation.Timed;
import ai.bilge.spark.webshell.domain.Terminal;

import ai.bilge.spark.webshell.repository.TerminalRepository;
import ai.bilge.spark.webshell.web.rest.errors.BadRequestAlertException;
import ai.bilge.spark.webshell.web.rest.util.HeaderUtil;
import ai.bilge.spark.webshell.service.dto.TerminalDTO;
import ai.bilge.spark.webshell.service.mapper.TerminalMapper;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Terminal.
 */
@RestController
@RequestMapping("/api")
public class TerminalResource {

    private final Logger log = LoggerFactory.getLogger(TerminalResource.class);

    private static final String ENTITY_NAME = "terminal";

    private final TerminalRepository terminalRepository;

    private final TerminalMapper terminalMapper;

    public TerminalResource(TerminalRepository terminalRepository, TerminalMapper terminalMapper) {
        this.terminalRepository = terminalRepository;
        this.terminalMapper = terminalMapper;
    }

    /**
     * POST  /terminals : Create a new terminal.
     *
     * @param terminalDTO the terminalDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new terminalDTO, or with status 400 (Bad Request) if the terminal has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/terminals")
    @Timed
    public ResponseEntity<TerminalDTO> createTerminal(@RequestBody TerminalDTO terminalDTO) throws URISyntaxException {
        log.debug("REST request to save Terminal : {}", terminalDTO);
        if (terminalDTO.getId() != null) {
            throw new BadRequestAlertException("A new terminal cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Terminal terminal = terminalMapper.toEntity(terminalDTO);
        terminal = terminalRepository.save(terminal);
        TerminalDTO result = terminalMapper.toDto(terminal);
        return ResponseEntity.created(new URI("/api/terminals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /terminals : Updates an existing terminal.
     *
     * @param terminalDTO the terminalDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated terminalDTO,
     * or with status 400 (Bad Request) if the terminalDTO is not valid,
     * or with status 500 (Internal Server Error) if the terminalDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/terminals")
    @Timed
    public ResponseEntity<TerminalDTO> updateTerminal(@RequestBody TerminalDTO terminalDTO) throws URISyntaxException {
        log.debug("REST request to update Terminal : {}", terminalDTO);
        if (terminalDTO.getId() == null) {
            return createTerminal(terminalDTO);
        }
        Terminal terminal = terminalMapper.toEntity(terminalDTO);
        terminal = terminalRepository.save(terminal);
        TerminalDTO result = terminalMapper.toDto(terminal);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, terminalDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /terminals : get all the terminals.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of terminals in body
     */
    @GetMapping("/terminals")
    @Timed
    public List<TerminalDTO> getAllTerminals() {
        log.debug("REST request to get all Terminals");
        List<Terminal> terminals = terminalRepository.findAll();
        return terminalMapper.toDto(terminals);
        }

    /**
     * GET  /terminals/:id : get the "id" terminal.
     *
     * @param id the id of the terminalDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the terminalDTO, or with status 404 (Not Found)
     */
    @GetMapping("/terminals/{id}")
    @Timed
    public ResponseEntity<TerminalDTO> getTerminal(@PathVariable Long id) {
        log.debug("REST request to get Terminal : {}", id);
        Terminal terminal = terminalRepository.findOne(id);
        TerminalDTO terminalDTO = terminalMapper.toDto(terminal);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(terminalDTO));
    }

    /**
     * DELETE  /terminals/:id : delete the "id" terminal.
     *
     * @param id the id of the terminalDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/terminals/{id}")
    @Timed
    public ResponseEntity<Void> deleteTerminal(@PathVariable Long id) {
        log.debug("REST request to delete Terminal : {}", id);
        terminalRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
