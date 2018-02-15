package ai.bilge.spark.webshell.repository;

import ai.bilge.spark.webshell.domain.Shell;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Shell entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShellRepository extends JpaRepository<Shell, Long> {

}
